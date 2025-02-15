function systemLogs(req,res,next)
{
    const time = new Date();
    const object = {
        ip:req.ip,
        method:req.method,
        body:req.body,
        query:req.query,
        time:time
    }
    console.log(object);

    next();
}

module.exports = systemLogs;