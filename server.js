const exp = require("express")
const app = exp()
const CORS = require("cors")
const systemLogs = require("./log")
const allowedMethod = require("./Middlewares/protect")
const usersAPI = require("./APIs/usersAPI")
const postsAPI = require("./APIs/postsAPI")
require("dotenv").config()
const path = require("path")
const adminAPI = require("./APIs/adminAPI")
const MongoClient = require("mongodb").MongoClient

app.use(exp.json())
app.use( CORS( ))

const MONGO_DB_URL = process.env.MONGO_DB_URL;
MongoClient.connect( MONGO_DB_URL ).then( client => {
    const DB = client.db("blog")

    const users = DB.collection("users")
    const posts = DB.collection("posts")
    const deletedPosts = DB.collection("deletedPosts")
    const logs = DB.collection("logs")
 
    app.set("users" , users);
    app.set("posts" , posts);
    app.set("deletedPosts" , deletedPosts)
    app.set("logs" , logs)

    console.log("Mongo DB connected")
}).catch(err => {
    console.log("MongoDB connection error.");
    console.log(err)
})

// app.use((req,res,next)=>DBAccess(req,res,next))

app.use((req,res,next) => {
    systemLogs(req,res,next)
})


app.get('/' , (req,res)=>{
    res.json({"message":"hi i am blog app server"});
})



app.use('/users' , usersAPI)
app.use("/posts" , postsAPI)
app.use("/admin" , adminAPI)

app.get('*' , (req,res)=>{
    res.send("<h1>404 , route not found</h1>")
})

const PORT = process.env.PORT

app.listen( PORT , ()=>console.log(`server running on PORT ${PORT}`))