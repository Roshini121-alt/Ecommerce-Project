import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import { likeSchema } from "./like.schema.js";

const likeModel=new mongoose.model('like',likeSchema);

export class LikeRepository{
    async likeProduct(userId,productId){
        try{
            const alreadyLiked=await likeModel.findOne({
                userId:userId,
                likeable:productId,
                types:"product"
            });

            if(!alreadyLiked){
                const newLike=new likeModel({
                    userId:userId,
                    likeable:productId,
                    types:"product"
                })
                await newLike.save();
            }
            
        }catch(err){
            console.log(err);
            throw new Error("something went wrong while liking the product")
        }
    }

    async likeCategory(userId,categoryId){
        try{
            const alreadyLiked=await likeModel.findOne({
                userId:userId,
                likeable:categoryId,
                types:"category"
            })

            if(!alreadyLiked){
                const newLike=new likeModel({
                    userId:new ObjectId(userId),
                    likeable:new ObjectId(categoryId),
                    types:"category"
                });
                await newLike.save();
            }
            
        }catch(err){
            console.log(err);
            throw new Error("something went wrong while liking the category")
        }
    }

    async getLikes(type,id){
        //inorder to return complete user who liked it and the complete product/category which is liked use "populate" method;
        return await likeModel.find({
            likeable:new ObjectId(id),
            types:type
        }).populate('userId').populate({path:'likeable',model:type});

        //here "populate({path:'likable',model:type})" this line says that:-model takes the type and go to its collection(eg:products collection) 
        // and take the path given from likeable id and return that complete product object of matching id 
    }

    async getLikesOfUser(userId){
        return await likeModel.find({
            userId:new ObjectId(userId)
        });
    }
}