import UserModel from "../features/user/user.model.js";

const basicAuthorizer=(req,res,next)=>{
    //1.check if authorization header is empty.
    const authHeader=req.headers["authorization"];
    if(!authHeader){
        return res.status(401).send('No authorization details found');
    }

    console.log(authHeader);
    //2.extract credentials.(encode in base 64). [Basic qwwertyui1234567dfgh5tg6yh]
    const base64Credentials=authHeader.replace('Basic ','');
    console.log(base64Credentials)

    //3.decode the credentials gives the actual mail and password
    const decodedCreds=Buffer.from(base64Credentials,'base64').toString('utf8');
    console.log(decodedCreds); //[username:password]

    const cred=decodedCreds.split(':')  //[username,password]
    const [email,password]=cred;
    //or const [email,password]=decodedCreds.split(':')
    const user=UserModel.getAll().find((user)=>user.email==email && user.password==password)

    if(user){
        next();
    }else{
        return res.status(401).send('Incorrect credentials')
    }
}

export default basicAuthorizer;