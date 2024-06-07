import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';


import dotenv from 'dotenv';
dotenv.config();


mongoose.connect("mongodb+srv://Shivam:Shivam@authentication.rfozv26.mongodb.net/?retryWrites=true&w=majority&appName=Authentication")
.then(()=>
{
    console.log("DB CONNECTED")
})
. catch(()=>
{
    console.log("Error in connection with db")
})

const __dirname = path.resolve();
const app = express();

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>
{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
});
app.use(express.json());
app.use(cookieParser());

app.listen(3001,()=>
{
    console.log("Listening to 3001")
})
app.use("/api/user",userRoutes); 
app.use("/api/auth",authRoutes);

app.use((err, req, res, next)=>
{
    const statusCode = err.statusCode || 500;
    const mssg = err.mssg || 'internal server error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        mssg,
    });
});
