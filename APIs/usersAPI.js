const exp = require("express")
const { ObjectId } = require("mongodb")
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

usersAPI.put("/change-username" , async(req,res) => {
    const usersCollection =  req.app.get("users");
    
    try{
        const { userName , id } = req.body;

        const existence = await usersCollection.find( { userName : userName } ).toArray();
        if(existence.length == 0 ){
            // unique name
            const updateStatus = await usersCollection.updateOne( { "_id": new ObjectId(id) } , { $set:{ userName:userName } } )
            res.send( {
                success:true,
                message:"userName modified",
                data:updateStatus
            })
        }else{
            res.send( {
                success:false,
                message:"userName already exists"
            })
        }
    }catch(err){
        res.send( {
            success:false,
            message:"error with request",
            data:err.message
        })
    }
})


usersAPI.put('/change-photo' ,async (req,res) => {
    const usersCollection = req.app.get('users')
    
    try{
        const {id , photo} = req.body;
        const updateStatus = await usersCollection.updateOne({ "_id" : new ObjectId(id)} , { $set: { photo:photo}} );

        res.send({
            success:true,
            message:"photo updated",
            data:updateStatus
        })
    }catch(err){
        res.send({
            success:false,
            message:"photo not updated",
            data:err.message
        })
    }
})

module.exports = usersAPI;