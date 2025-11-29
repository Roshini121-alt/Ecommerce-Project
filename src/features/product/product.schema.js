import mongoose from "mongoose";

export const productSchema=new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    imageUrl:String,
    category:String,
    sizes:{type:[String],required:true},
    stock:Number,
    //mention all reviews of a product
    reviews:[
        {
            //here id is of review id of matching product
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    //mention all categories which the product belongs to
    categories:[
        {
            //here id is of category id of which this product belongs to
            type:mongoose.Schema.Types.ObjectId,
            ref:"category"
        }
    ]
})