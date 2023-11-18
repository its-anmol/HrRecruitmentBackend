const app=require("./app")
const dotenv=require("dotenv")

//config
dotenv.config({path:"backend/config/config.env"})

// Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`shuttind down server due to unhandled promise rejection`)
    process.exit(1);
})

//database
const connectDatabase=require("./config/database")
connectDatabase();


const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on port${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection",err=>{
    console.log(`error:${err.message}`)
    console.log(`shitting down server due to server rejection`)
    server.close(()=>{
        process.exit
    })
})