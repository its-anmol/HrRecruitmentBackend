const express=require("express")
const app=express()
const cookieParser=require("cookie-parser")

const errorMiddleware=require("./middleware/error")

app.use(express.json());
app.use(cookieParser());
//Route import

/* user Routes   */
const user=require("./routes/userroutes");
app.use("/api/v1",user)

/* Admin Routes */
const admin=require("./routes/adminroutes")
app.use("/api/v1",admin)



// middleware for error
app.use(errorMiddleware)


module.exports=app