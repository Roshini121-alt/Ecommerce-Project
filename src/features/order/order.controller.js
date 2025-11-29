import OrderRepository from './order.repository.js';


export default class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository()
    }

    async placeOrder(req,res,next){
        try{
            const userId=req.userId;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("order is created")
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong while placing order");
        }
    }
}
