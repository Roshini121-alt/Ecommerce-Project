import mongoose from "mongoose";

export const orderSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    totalAmount:Number,
    timeStamp:{type:Date,default:Date.now}
})