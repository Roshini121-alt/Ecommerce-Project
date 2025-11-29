import UserModel from "../user/user.model.js";

export default class ProductModel{
    constructor(name,desc,price,imageUrl,category,sizes){
        this.name=name;
        this.desc=desc;
        this.price=price;
        this.imageUrl=imageUrl;
        this.category=category;
        this.sizes=sizes;
    }

    static getAll(){
        return products;
    }

    static add(product){
        product.id=products.length+1;
        products.push(product);
        return product;
    }

    static get(id){
        const product=products.find((p)=>p.id==id);
        return product;
    }

    static filter(minPrice, maxPrice, category){
        console.log(products);
        const result = products.filter((product)=>{
          return(
          (!minPrice || 
            product.price >= minPrice) &&
          (!maxPrice || 
            product.price <= maxPrice) &&
          (!category || 
            product.category == category)
          );
        });
        return result;
    }

    static rateProduct(productId,userId,rating){
      //1.validate user and product
      const user=UserModel.getAll().find((u)=>u.id==userId);
      if(!user){
        return 'user not found';
      }

      const product=products.find((p)=>p.id==productId);
      console.log(product);
      if(!product){
        return "product not found"
      }

      //2.check if their are any ratings,if not then add ratings array
      if(!product.ratings){
        product.ratings=[];
        product.ratings.push({userId:userId,rating:rating});
      }else{
        //3.check if user rating is already available.
        const existingRatingIndex=product.ratings.findIndex((r)=>r.userId==userId);
        if(existingRatingIndex>=0){
          product.ratings[existingRatingIndex]={userId:userId,rating:rating};
        }else{
          //4.if no existing user's rating,then add rating
          product.ratings.push({userId:userId,rating:rating})
        }
      }
    }
}

var products=[
    new ProductModel(1,"Product1","Description for Project 1",19.99,"https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",'category1' ),
    new ProductModel(2,"Product2","Description for Project 2",29.99,"https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",'category2',['M','XL'] ),
    new ProductModel(3,"Product3","Description for Project 3",39.99,"https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",'category3',['M','XL','S'] ),
];