const app =require("./app");
const debug =require("debug")("node-angular");
const http =require("http");
const { EACCES, EADDRINUSE } = require("constants");

const normalizedPort=val=>{
    var port = parseInt(val,10)
    if(isNaN(port))
    {
        return val
    }
    if(port>=0)
    {
        return port
    }
    return false;
}

const onError = error =>{
    if(error.syscall !=="listen")
    {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe" +port: "port" +port;
    switch(error.code)
    {
        case "EACCES":
            console.log(bind+ "reqiures elivated privilages");
            process.exit(1);
            break;

        case "EADDRINUSE":
            console.error(bind+ "is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening =() =>
{
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe" + port : "port" + port;
    debug("Listening on" +bind);
}

const port = normalizedPort(process.env.PORT||3000);
app.set("port",port)

console.log("Server started at port 3000");

const server = http.createServer(app);
server.on("error",onError);
server.on("listening",onListening);
server.listen(port);