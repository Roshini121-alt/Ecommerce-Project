import cartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class cartController{
    constructor(){
        this.cartRepository=new CartRepository();
    }

    async add(req,res){
        try{
            const {productId,quantity}=req.body;
            const userId=req.userId;
            const error=await this.cartRepository.add(productId,userId,quantity);
            if(error){
                res.status(400).send(error);
            }else{
                res.status(200).send('Item added in the cart')
            }
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
        
    }

    async getusercart(req,res){
        try{
            const userId=req.userId;
            const items=await this.cartRepository.get(userId);
            return res.status(200).send(items);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async delete(req,res){
        const userId=req.userId;
        const id=req.params.id;
        const error=await this.cartRepository.delete(id,userId);
        if(error){
            res.status(404).send(error);
        }else{
            res.status(200).send('Cart Item is deleted')
        }
    }
}