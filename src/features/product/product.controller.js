import ProductModel from "./product.modal.js";
import productRepository from "./product.repository.js"

export default class ProductController{
    constructor(){
        this.productRepository=new productRepository();
    }

    async getAllProducts(req,res){
        try{
            const products=await this.productRepository.getAll();
            res.status(200).send(products);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }
    
    async addProduct(req,res){
        try{
            const {name,price,sizes,categories,description}=req.body;
            const newproduct=new ProductModel(name,description,parseFloat(price),req.file.filename,categories,sizes.split(','))
            const createdRecord=await this.productRepository.add(newproduct);
            res.status(201).send(createdRecord)
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async rateProduct(req,res){
        const userId=req.userId;
        const productId=req.body.productId;
        const rating=req.body.rating;
        const error=await this.productRepository.rate(productId,userId,rating);
        if(error){
            return res.status(400).send(error);
        }else{
            return res.status(200).send('Rating has been added');
        }
    }

    async getOneProduct(req,res){
        try{
            const id=req.params.id;
            const product=await this.productRepository.get(id);
            if(!product){
                res.status(404).send("Product not found")
            }else{
                return res.status(200).send(product);
            }
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async filterProducts(req, res) {
        try{
            const minPrice = req.query.minPrice;
            // const maxPrice = req.query.maxPrice;
            const categories = req.query.categories;
            const result = await this.productRepository.filter(minPrice,categories);
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async averageprice(req,res,next){
        try{
            const result=await this.productRepository.averageproductPricePerCategory();
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async averageRating(req,res){
        try{
            const result=await this.productRepository.averageRatingPerProduct();
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }

    async countOfRating(req,res){
        try{
            const result=await this.productRepository.countOfRatingsPerProduct();
            res.status(200).send(result);
        }catch(err){
            console.log(err);
            res.status(400).send("something went wrong");
        }
    }
}