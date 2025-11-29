import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';


const userRouter=express.Router()
const usercontroller=new UserController();

userRouter.post('/signup',(req,res,next)=>usercontroller.signUp(req,res,next));
userRouter.post('/signin',(req,res)=>usercontroller.signIn(req,res));
userRouter.put('/resetpassword',jwtAuth,(req,res)=>usercontroller.resetPassword(req,res));

export default userRouter