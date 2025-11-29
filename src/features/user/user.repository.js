import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

//creating model from schema
const userModel= mongoose.model('user',userSchema);

export default class userRepository{
    async signUp(user){
        try{
            //create instance of model
           const newUser=new userModel(user);
           await newUser.save();

        }catch(err){
            console.log(err);
            //this is user error not application error
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }else{
                throw new Error("Something went wrong with database")
            }
        }
    }

    async signIn(email,password){
        try{
           return await userModel.findOne({email,password})
        }catch(err){
            console.log(err);
            throw new Error("Something went wrong with database")
        }
    }

    async findByEmail(email){
        try{
            return await userModel.findOne({email});
        }catch(err){
            console.log(err);
            throw new Error("Something went wrong with database")
        }
    }

    async resetPassword(userId,newPassword){
        try{
            const user=await userModel.findOne({_id:userId})
            if(user){
                user.password=newPassword;
                user.save();
            }else{
                throw new Error("User not found")
            }
        }catch(err){
            console.log(err);
            throw new Error("Something went wrong with database")
        }
    }
}