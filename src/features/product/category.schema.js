
import mongoose from "mongoose";

export const categorySchema=new mongoose.Schema({
    categoryName:String,
    products:[
        {
            //product id belong to this category
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        }
    ]
})