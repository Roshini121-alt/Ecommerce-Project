import jwt from "jsonwebtoken";

const jwtAuth=(req,res,next)=>{
    //1.read the token
    const token=req.headers['authorization'];
    //2.if no token return the error.
    if(!token){
        return res.status(401).send("Unauthorized token");
    }

    //3.check if token is valid
    try{
        const payload=jwt.verify(token,"Rkcb7ntSTAwMCWjuEVyorC9WKnww5kiz");
        req.userId=payload.userID;
        console.log(payload);
    }catch(err){
        //4.return error
        return res.status(401).send("Unauthorized token");
    }

    //5.call next middleware
    next();
}

export default jwtAuth;