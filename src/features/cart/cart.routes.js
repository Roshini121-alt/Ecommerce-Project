import express from 'express';
import cartController from './cart.controller.js';

const cartRouter=express.Router();
const cartcontroller=new cartController();

cartRouter.get('/',(req,res)=>cartcontroller.getusercart(req,res));
cartRouter.delete('/delete/:id',(req,res)=>cartcontroller.delete(req,res));
cartRouter.post('/',(req,res)=>cartcontroller.add(req,res));

export default cartRouter;