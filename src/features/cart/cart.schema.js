import mongoose from "mongoose";

export const cartSchema=new mongoose.Schema({
    userId:{type:ObjectId,ref:"user"},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"product"},
    quantity:Number
})