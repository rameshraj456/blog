function DBAccess(req,res,next){
    const usersCollection = req.app.get("users")
    const postsCollection = req.app.get("posts")

    req.users = usersCollection;
    req.posts = postsCollection;
    
    next()
}

module.exports = DBAccess;