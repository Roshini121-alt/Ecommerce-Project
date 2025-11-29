import { getDB } from "../../config/mongodb.js";

class userRepository{
    async signUp(newUser){
        try{
            //1.get the database
            const db=getDB();

            //2.get the collection
            const collection=db.collection("users");

            //3.insert the document(signup details)
            await collection.insertOne(newUser)
            return newUser
        }catch(err){
            console.log(err);
            // throw new 
            res.send("something went wrong");
        }
    }

    async signIn(email,password){
        try{
            //1.get the database
            const db=getDB();

            //2.get the collection
            const collection=db.collection("users");

            //3.Find the document(find the signin details)
            const user=await collection.findOne({email,password});
            return user;
        }catch(err){
            console.log(err);
            // throw new 
            res.send("something went wrong");
        }
    }

    async findByEmail(email){
        try{
            //1.get the database
            const db=getDB();

            //2.get the collection
            const collection=db.collection("users");

            //3.Find the document(find the signin details)
            const user=await collection.findOne({email});
            return user;
        }catch(err){
            console.log(err);
            // throw new 
            res.send("something went wrong with email");
        }
    }
}

export default userRepository;