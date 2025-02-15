const exp = require("express")
const usersAPI = exp.Router()

usersAPI.get("/" , (req,res)=>{
    res.send("usersAPI")
})

usersAPI.get("/all-users" , async (req,res)=>{
    const usersCollection =  req.app.get("users");
    const users = await usersCollection.find().toArray();

    res.send(users);
})

function generateUserName() {
    return Math.random().toString(36).substring(2, 10);
}

usersAPI.post("/login" , async (req,res)=>{
    const usersCollection =  req.app.get("users");
    const existence = await usersCollection.find( { email:req.body.email } ).toArray()
    if(existence.length == 0 ){
        let user = {
            "userName":generateUserName(),
            "createdOn": new Date(),
            "email":req.body.email ,
            "photo":req.body.photo ,
            "password":generateUserName()
        }
        await usersCollection.insertOne( user )
        res.send({
            success:true,
            message:"user created",
            data:user
        })
    }
    else{
        res.send({
            success:true,
            message:"user logged",
            data:existence[0]
        })
    }
})

usersAPI.post("/login-with-user-name" , async (req,res)=>{
    const usersCollection =  req.app.get("users");
    const existence = await usersCollection.find( { userName:req.body.userName } ).toArray()

    console.log(existence[0]);

    if(existence.length == 0 ){
        res.send({
            success:false,
            message:"user not found"
        })
    }
    else{
        console.log( req.body.password , existence[0].password )
        if( existence[0].password == req.body.password ){
            res.send({
                success:true,
                message:"user logged",
                data:existence[0]
            })
        }else{
            res.send({
                success:false,
                message:"incorrect password"
            })
        }
    }
})



module.exports = usersAPI;