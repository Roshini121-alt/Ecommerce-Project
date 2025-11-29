import { getDB } from "../../config/mongodb.js"
import { ObjectId, ReturnDocument } from 'mongodb';

export default class CartRepository{
    constructor(){
        this.cartCollection="cartItems";
    }


    async add(productId,userId,quantity){
        try{
            const db=getDB();
            const cartCollection=db.collection(this.cartCollection);
            const userCollection=db.collection("users");
            const productCollection=db.collection("products");
            const users=await userCollection.find().toArray();
            const user=users.find((user)=>user._id.equals(new ObjectId(userId)));
            // const user = users.find((user) => user._id.toString() === userId);
            if(!user){
                return 'user not found';
            }

            const products=await productCollection.find().toArray()
            const product=products.find((prod)=>prod._id.equals(new ObjectId(productId)));
            if(!product){
                return 'product not found to add in the cart';
            }

            //method--1
            //1.find if cart is present or not 
            const existingCart=await cartCollection.findOne({productId:new ObjectId(productId),userId:new ObjectId(userId)})
            //2.if exist update cart quantity
            console.log(existingCart)
            if(existingCart){
                await cartCollection.updateOne({productId:new ObjectId(productId),userId:new ObjectId(userId)},{$inc:{quantity:quantity}});
            //3.if not,insert new cart
            }else{
                const id=await this.getNextCounter(db);
                await cartCollection.insertOne({_id:id,productId:new ObjectId(productId),userId:new ObjectId(userId),quantity:quantity});
            }

            //method--2 
            //find the document
            //either insert or update accordingly
            //here updtaeone function perform both update and insertion operations due to (upsert:true)-->this upsert is the option in the updateone function syntax
            // await cartCollection.updateOne({productId:new ObjectId(productId),userId:new ObjectId(userId)},{$setOnInsert:{_id:id},$inc:{quantity:quantity}},{upsert:true});
            // Increment quantity	{ $inc: { quantity: quantity } }
            // Set a new quantity value	{ $set: { quantity: quantity } }
        }catch(err){
            console.log(err);
            return "something went wrong while adding to cart"
        }
    }

    async get(userId){
        try{
            const db=getDB();
            const cartCollection=db.collection(this.cartCollection);
            const userCollection=db.collection("users");
            const users=await userCollection.find().toArray();
            const user=users.find((user)=>user._id.equals(new ObjectId(userId)));
            if(!user){
                return 'user not found';
            }
            const cartItems= await cartCollection.find({userId:new ObjectId(userId)}).toArray();
            console.log(cartItems);
            return cartItems;
        }catch(err){
            console.log(err);
            return "something went wrong while getting cart items"
        }
    }


    async delete(cartItemId,userId){
        try{
            const db=getDB();
            const cartCollection=db.collection(this.cartCollection);
            const userCollection=db.collection("users");
            const users=await userCollection.find().toArray();
            const user=users.find((user)=>user._id.equals(new ObjectId(userId)));
            if(!user){
                return 'user not found';
            }
            const result=await cartCollection.deleteOne({userId:new ObjectId(userId),_id:new ObjectId(cartItemId)})
            console.log(result);
            if(!result.deletedCount>0){return "Cart not found"}
        }catch(err){
            console.log(err);
            return "something went wrong while deleting the cart item"
        }
    }

    async getNextCounter(db){
        const resultDocument=await db.collection("counters").findOneAndUpdate({_id:"cartItemId"},{$inc:{value:1}},{returnDocument:"after"});
        return resultDocument.value;
    }
}