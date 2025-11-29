import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import userRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController{
    constructor(){
        this.userRepository=new userRepository();
    }

    async signUp(req,res,next){
        try{
            const {name,email,password,type}=req.body;

            //hash the password
            const hassedPassword=await bcrypt.hash(password,10)
            const user=new UserModel(name,email,hassedPassword,type);
            await this.userRepository.signUp(user);
            // const {password,...restUser}=user;
            res.status(201).send(user);
        }catch(err){
            next(err);
            console.log(err);
        }
    }

    async signIn(req,res){
        try{
            //1.find user by email
            const user=await this.userRepository.findByEmail(req.body.email);
            if(!user){
                return res.status(400).send("Invalid credentials")
            }else{
                //2.compare password with hassedpassword
                const result=await bcrypt.compare(req.body.password,user.password);
                if(result){
                    //1.create token
                    const token=jwt.sign({userID:user._id,email:user.email},process.env.JWT_SECRET,{
                        expiresIn:"1h",
                    })
                    //2.send token
                    return res.status(200).send(token)
                }else{
                    return res.status(400).send('Incorrect credentials')
                }
            }
            
        }catch(err){
            console.log(err);
            return res.status(400).send("something went wrong during signin");
        }
    }

    async resetPassword(req,res){
        try{
            const userId= req.userId;
            const {newPassword}=req.body;
            const hassedNewPassword=await bcrypt.hash(newPassword,12)
            await this.userRepository.resetPassword(userId,hassedNewPassword);
            res.status(200).send("Password is reset");
        }catch(err){
            console.log(err);
            return res.status(400).send("something went wrong during resetting peassword");
        }
    }
}