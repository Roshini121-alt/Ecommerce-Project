import mongoose from "mongoose";
import { LikeRepository } from "./like.repository.js";


export class LikeController{
    constructor(){
        this.likeRepository=new LikeRepository();
    }

    async addLike(req,res,next){
        try{
            const userId=req.userId;
            const {id,type}=req.body;
            if(type!="product" && type!="category"){
                res.status(400).send("Invalid type")
            }

            if(type=="product"){
                await this.likeRepository.likeProduct(userId,id)
            }else{
                await this.likeRepository.likeCategory(userId,id)
            }

            return res.status(200).send("liked successfully")
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    //to return the no.of likes of particular product or category
    async getLikes(req,res,next){
        try{
            //get product id or category id and their type from query
            const {id,type}=req.query;
            const likes=await this.likeRepository.getLikes(type,id);
            res.status(200).send(likes)
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    //an api to get all likes of a user
    async getLikesOfUser(req,res,next){
        try{
            //get product id or category id and their type from query
            const userId=req.userId;
            const likesOfUser=await this.likeRepository.getLikesOfUser(userId);
            res.status(200).send(likesOfUser)
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }
}