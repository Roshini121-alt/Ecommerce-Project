import dotenv from 'dotenv';
//load all the enviranment variables in this application 
dotenv.config();


//1.import express
import express from 'express';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
import orderRouter from './src/features/order/order.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import bodyParser from 'body-parser';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import swagger from 'swagger-ui-express';
// import apiDocs from './swagger.json' assert {type: 'json'};--this is not working here
import { readFileSync } from 'fs';
import cors from "cors";
import {connectToMongoDB} from './src/config/mongodb.js';
import { connectUsingMongoose } from './src/config/mongoose.js';
import mongoose from 'mongoose';

const apiDocs = JSON.parse(readFileSync('./swagger1.json', 'utf-8'));


//2.create server
const server=express();
server.use(bodyParser.json());

//CORS policy configuration -- with library
var corsOptions={
    origin:"http://127.0.0.1:5500",
    allowedHeaders:"*"
}
server.use(cors(corsOptions))

//CORS policy configuration
// server.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin",'http://127.0.0.1:5500');
//     res.header("Access-Control-Allow-Headers","*");
//     res.header("Access-Control-Allow-Methods","*");
//     //return OK for preflight request
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }

//     next();
// })

//routers
//for all the request related to product,redirect to product routes
//localhost:3000/api/products
server.use('/api-docs',swagger.serve,swagger.setup(apiDocs)); //swagger
server.use('/api/products',jwtAuth,productRouter);
server.use('/api/users',userRouter);
server.use('/api/cart',jwtAuth,cartRouter);
server.use('/api/orders',jwtAuth,orderRouter)
server.use('/api/likes',jwtAuth,likeRouter);


//3.default request handler
server.get('/',(req,res)=>{
    res.send("Welcome to Ecommerce API's")
});


//Error handler middleware---we had added this middleware which handles any error inside application if it is thrown
server.use((err,req,res,next)=>{
    console.log(err);
    // if(err instanceof ApplicationError){
    //     return res.status(err.code).send(err.message);
    // }

    if(err instanceof mongoose.Error.ValidationError){
       return  res.status(400).send(err.message);
    }
    //server errors
    res.status(500).send("something went wrong,please try later");
});

//4.middleware to handle 404 requests.
server.use((req,res)=>{
    res.status(404).send("API not found. Please check the documentation for more information at localhost:3000/api-docs")
})

//5.specify port
server.listen(3000,()=>{
    console.log('server is running at 3000');
    // connectToMongoDB();
    connectUsingMongoose();
});
