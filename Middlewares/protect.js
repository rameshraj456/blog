function allowedMethod(req,res,next)
{
    if(req.method == "GET"){
        res.status(400).json({
            success:false,
            message:"GET request not allowed"
        })
    }
}

module.exports = allowedMethod;