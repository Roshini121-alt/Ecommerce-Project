import { ObjectId } from "mongodb";
import { getDB,getClient } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }


    async placeOrder(userId){
        const client=getClient();
        const session=client.startSession();
        try{
            const db=getDB();
            session.startTransaction();
            //1.get cartItems and calculate total amount.
            const items= await this.getTotalPrice(userId,session);
            const FinalTotalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0)
            console.log(FinalTotalAmount);

            //2.create an order record 
            const NewOrder=new OrderModel(userId,FinalTotalAmount,new Date());
            await db.collection(this.collection).insertOne(NewOrder,{session});

            //3.reduce the stock
            for(let item of items){
                await db.collection("products").updateOne({_id:item.productId},{$inc:{stock:-item.quantity}},{session})
            }

            // throw new Error("something went wrong in placeorder")
            //4.clear the cart items
            await db.collection("cartItems").deleteMany({userId:new ObjectId(userId)},{session});
            session.commitTransaction();
            session.endSession();

        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            res.send("something went wrong")
        }  
    }

    async getTotalPrice(userId,session){
        const db=getDB();
        const items=await db.collection("cartItems").aggregate([
            //1.get cart items for the user
            {
                $match:{userId:new ObjectId(userId)}
            },

            //2.use lookup and get products from products collection 
            {
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },

            //3.unwind the productInfo
            {
                $unwind:"$productInfo"
            },

            //4.calculate totalprice of individual cart items (quantity*price)
            {
                $addFields:{
                    "totalAmount":{$multiply:["$productInfo.price","$quantity"]}
                }
            }
        ],{session}).toArray();
        return items;
    }
}
