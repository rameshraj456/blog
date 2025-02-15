const { ObjectId } = require("bson")
const exp = require("express")
const postsAPI = exp.Router()


postsAPI.get("/" , (req,res)=>{
    res.send("posts API")
})

postsAPI.get("/all-posts" , async (req,res)=>{
    const postsCollection = req.app.get("posts");
    const posts = await postsCollection.find().toArray();

    res.send({
        success:true,
        message:"all posts",
        data:posts
    })
})

postsAPI.post("/create-post" , async(req,res)=>{
    const postsCollection = req.app.get("posts");
    let status = await postsCollection.insertOne( req.body );
    res.send({
        success:true,
        message:"post created",
        data:status
    })
})

postsAPI.delete('/delete-post' , async(req,res)=>{
    const postsCollection = req.app.get("posts");
    const deletedPosts = req.app.get("deletedPosts");

    try{
        const post = await postsCollection.find( { "_id": new ObjectId( req.body.id )} ).toArray()
        console.log(post[0]);

        const insertionStatus = await deletedPosts.insertOne( post[0] );
        const deletedStatus = await postsCollection.deleteOne( { "_id":new ObjectId( req.body.id ) } )

        res.send({
            success:true,
            message:"post deleted",
            data:{
                insertionStatus,
                deletedStatus
            }
        })
    }catch( err ){
        res.send({
            success:false,
            message:"post not deleted",
            data:err.message
        })
    }


})

// postsAPI.put("/like-post" , async(req,res) => {
//     const postsCollection = req.app.get("posts");

//     const { postId , userId } = req.body;
//     const likeStatus = await postsCollection.find( { "_id":new ObjectId(postId) } ).toArray();
//     const allLikes = likeStatus[0].likes;
//     let status = false;
//     allLikes.forEach( id => {
//         if(id == userId ){
//             status = true;
//             break;
//         }
//     })
// })

module.exports = postsAPI;