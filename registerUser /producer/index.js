const amqp = require("amqplib");
const mongoose = require("mongoose");
const express = require("express"); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserModel = require("./models/User");


const PORT = 4003;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/Demo")

var channel, connection;
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        await channel.assertQueue("user-queue")

    } catch (error) {
        console.log(error)
    }
}
connectQueue()

async function sendData(user) {
    try {
        await channel.sendToQueue("user-queue", Buffer.from(JSON.stringify(user)));
        console.log("A message is sent to queue");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
//register user
app.post("/registerUser",async(req,res)=>{
    try {
        const { username,email, password,role } = req.body;  
        const user = await UserModel.create({username,email, password,role })
        sendData(user);
        if (!username || !password) {
            return res.status(400).json({
                status: "Error",
                message: "Username and password are required",
            });
        }
        res.status(200).json({
            status: "OK",
            message: "User created Successfully",
            user:{
                username:user.username,
                email:user.email,
                role: user.role
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: "Failed to create user",
            error: err.message,
        })
    }
})

app.listen(PORT,()=>{
     console.log(PORT + " Server is Running");
});