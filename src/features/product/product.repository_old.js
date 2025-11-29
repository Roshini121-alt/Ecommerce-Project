import { ObjectId } from 'mongodb';
import {getDB} from '../../config/mongodb.js'

class productRepository{
    async add(newProduct){
        try{
            //1.get db.
            const db= getDB();
            const collection=db.collection("products");
            await collection.insertOne(newProduct);
            return newProduct;
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while adding product")
        }
    }

    async getAll(){
        try{
            const db= getDB();
            const collection=db.collection("products");
            const allProducts=await collection.find().toArray();
            return allProducts;
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while returning all products")
        }
    }

    async get(id){
        try{
            const db=getDB();
            const collection=db.collection("products");
            // const id=new ObjectId(id)
            return await collection.findOne({_id:new ObjectId(id)});
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while filtering the products")
        }
    }

    // async rate(productId,userId,rating){
    //     try{
    //         const db=getDB();
    //         const collection=db.collection("products");
    //         //1.find the product
    //         const productFound=await collection.findOne({_id:new ObjectId(productId)})
    //         //2.find if their is rating with the userid in rating array.
    //         const userRating=productFound?.ratings?.find((r)=>r.userId==userId)
    //         if(userRating){
    //             //3.update the rating
    //             await collection.updateOne({_id:new ObjectId(productId),"ratings.userId":new ObjectId(userId)},{$set:{"ratings.$.rating":rating}});
    //             //can also done in this way to check the matched userId
    //             // const result = await collection.findOne({ 
    //             //     ratings: { $elemMatch: { userId: new ObjectId(userId)} }
    //             // });
    //         }else{
    //             await collection.updateOne({_id:new ObjectId(productId)},{$push:{ratings:{userId:new ObjectId(userId),rating}}})
    //         }
    //     }catch(err){
    //         console.log(err);
    //         res.status(400).send("something went wrong while adding rating to the product")
    //     }
    // }

    async rate(productId,userId,rating){
        try{
            const db=getDB();
            const collection=db.collection("products");
            //1.remove existing entry
            await collection.updateOne({_id:new ObjectId(productId)},{$pull:{ratings:{userId:new ObjectId(userId)}}});

            //2.add new entry
            await collection.updateOne({_id:new ObjectId(productId)},{$push:{ratings:{userId:new ObjectId(userId),rating}}})
            
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while adding rating to the product")
        }
    }

// Feature	$set	$push
// Purpose	Update or create a field	Add elements to an array field
// Type of Field	Works on any field type	Works specifically on array fields
// Behavior	Overwrites the existing value	Adds elements without overwriting
// Creates Field	Creates the field if it doesn't exist	Creates the array field if missing


    async filter(minPrice,categories){
        try{
            const db=getDB();
            const collection=db.collection("products");
            let filterExpression={}
            if(minPrice){
                filterExpression.price={$gte:parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price={...filterExpression.price,$lte:parseFloat(maxPrice)}
            // }

            //['cat1','cat2']-- if single codes are present change or replace to double codes(""),if already "" are present no need to replace them 
            categories=JSON.parse(categories.replace(/'/g,'"')); 
            if(categories){
                filterExpression={$and:[{category:{$in:categories}},filterExpression]} //-- if the categories is in array format .
                // filterExpression={$and:[{category:category},filterExpression]} -- if the category is /categories is not in an array format only single category is given like category:cat1 --- recevied in the string format({ price: { '$gte': 2000 }, category: 'cat2' })
                // filterExpression.category=category
            }
            const filteredProducts= await collection.find(filterExpression).project({name:1,price:1,_id:0,ratings:{$slice:1}}).toArray();
            //slice is used to indicate no.of items you need 
            return filteredProducts;
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while filtering the products")
        }
    }

    async averageproductPricePerCategory(){
        try{
            const db=getDB();
            return await db.collection("products").aggregate([
                //stage 1: group products according to category and calculate avg of price
                {
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while calculating averages of products")
        }
    }

    async averageRatingPerProduct(){
        try{
            const db=getDB();
            return await db.collection("products").aggregate([
                //stage1:unwind the ratings array(create documents for ratings)
                {
                    $unwind:"$ratings",
                },

                //stage2:group rating per product and calculate average of ratings
                {
                    $group:{
                        _id:"$name",
                        averageRating:{$avg:"$ratings.rating"}
                    }
                }
            ]).toArray();
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while calculating averages of products")
        }
    }

    async countOfRatingsPerProduct(){
        try{
            const db=getDB();
            return await db.collection("products").aggregate([
                //stage1:project name and count of ratings
                {
                    $project:{name:1,countOfRatings:{
                        $cond:{if:{$isArray:"$ratings"},then:{$size:"$ratings"},else:0}
                    }}
                },

                //stage2:sort the collection(1:ascending ,-1:descending)
                {
                    $sort:{countOfRatings:-1}
                },

                // // //stage3:limit to just 1 item in result
                // {
                //     $limit:1
                // }
                
                // // Stage 3: Get the lowest rating count value
                // {
                //     $group: {
                //         _id: null,
                //         lowestCount: { $min: "$countOfRatings" },
                //         products: { $push: "$$ROOT" }
                //     }
                // },

                // // Stage 4: Filter only products with the lowest count
                // {
                //     $project: {
                //         _id: 0,
                //         products: {
                //             $filter: {
                //                 input: "$products",
                //                 as: "product",
                //                 cond: { $eq: ["$$product.countOfRatings", "$lowestCount"] }
                //             }
                //         }
                //     }
                // }
            ]).toArray();
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while calculating averages of products")
        }
    }
}

export default productRepository;