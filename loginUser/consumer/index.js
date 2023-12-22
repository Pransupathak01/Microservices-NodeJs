const amqp = require("amqplib");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4007;
app.use(express.json());
async function connectQueue(){
    try{
        connection = await amqp.connect("amqp://localhost:5672");
        channel =await connection.createChannel()
        await channel.assertQueue("login-queue")   
    } catch(error){
        console.log(error)
    }
}
connectQueue();
async function consumeData (uData){
    try{
        channel.consume("login-queue",(user)=>{
            const userData = Buffer.from(user.content).toString();
             console.log(userData);
            channel.ack(user);
            uData(userData);
        });
    }catch(error){
        console.log(error)
    }
}

app.get("/consume",(req,res)=>{
    try{
        consumeData((consumedUser) =>{
            res.json({userData:consumedUser})
        });
        //res.send("Consuming data")
        
    }catch(error){
        res.status(500).send("Error while consuming user data ")
    }
})
app.listen(PORT,()=> console.log("Server running at port " + PORT));