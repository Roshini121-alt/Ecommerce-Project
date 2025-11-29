
import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";

//using async function for promises
export const  connectUsingMongoose=async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        addCategories();
        console.log("Mongodb using mongoose is connected")
    }catch(err){
        console.log(err);
    }
}

//using then for promises
// export const connectUsingMongoose= ()=>{
//     mongoose.connect(process.env.DB_URL)
//     .then(()=>{
//         console.log("connected to MongoDB using Mongoose")
//     }).catch((err)=>{
//         console.log(err)
//     })
// }

async function addCategories(){
    const categoryModel=mongoose.model('category',categorySchema);
    const categories=await categoryModel.find();
    if(!categories || categories.length==0){
        await  categoryModel.insertMany([{categoryName:'Books'},{categoryName:"Electronics"},{categoryName:"Clothing"}])
    }
    console.log("Categories are added")
}