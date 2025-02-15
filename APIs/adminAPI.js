const { ObjectId } = require("bson");
const exp = require("express")
const adminAPI = exp.Router()


adminAPI.post("/login" , (req,res)=>{
    const {userName , password} = req.body;

    if(userName == process.env.ADMIN_USER_NAME && password == process.env.ADMIN_PASSWORD ){
        res.send({
            success:true,
            message:"admin login success"
        })
    }else{
        res.send({
            success:false,
            message:"admin login failed"
        })
    }
})

adminAPI.get("/deleted-posts" , async (req,res) => {
    const deletedPosts = req.app.get("deletedPosts");
    let data = await deletedPosts.find().toArray()
    
    res.send({
        success:true,
        message:"deleted posts",
        data:data
    })
})

adminAPI.delete("/delete-deleted-posts" , async (req,res) => {
    const deletedPosts = req.app.get("deletedPosts");
    let data = await deletedPosts.deleteOne( { "_id" : new ObjectId(req.body.id) } )
    
    res.send({
        success:true,
        message:"deleted posts",
        data:data
    })
})

module.exports = adminAPI;