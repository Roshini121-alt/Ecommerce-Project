//manage routes/paths to product controller

//1.import express.
import express from 'express';
import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js';

//2.Initialize express router
const productRouter=express.Router();
const productController=new ProductController();

//all the paths to the controller methods.
//localhost:3000/api/products
productRouter.get('/',(req,res)=>productController.getAllProducts(req,res));
//localhost:3000/api/products/filter?minPrice=10&maxPrice=20&category=category1
productRouter.get('/filter',(req,res)=>productController.filterProducts(req,res));
productRouter.get('/averagePrice',(req,res)=>productController.averageprice(req,res));
productRouter.get('/averageRating',(req,res)=>productController.averageRating(req,res));
productRouter.get('/countOfRatings',(req,res)=>productController.countOfRating(req,res));
productRouter.get('/:id',(req,res)=>productController.getOneProduct(req,res));
productRouter.post('/',upload.single('imageUrl'),(req,res)=>productController.addProduct(req,res));
productRouter.post('/rate',(req,res)=>productController.rateProduct(req,res));


export default productRouter;


// How to Determine Route Order

// When defining routes, follow these guidelines:

// 1)Start with General Routes:
// i)/ → Retrieves all products.
// ii)/filter → Filters products based on conditions.
// iii)/averagePrice → Calculates and returns average price.

// 2)Define More Specific Routes Next:
// i)/search/:query → Searches products.
// ii)/category/:categoryName → Filters by category.

// 3)Place Dynamic Routes Last:
// i)/:id → Retrieves a single product using its ID.