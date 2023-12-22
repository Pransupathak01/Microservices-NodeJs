const amqp = require("amqplib");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4004;
app.use(express.json());
async function connectQueue(){
    try{
        connection = await amqp.connect("amqp://localhost:5672");
        channel =await connection.createChannel()
        await channel.assertQueue("user-queue")   
    } catch(error){
        console.log(error)
    }
}
connectQueue();
async function consumeData (){
    try{
        channel.consume("user-queue",(user)=>{
             console.log(`${Buffer.from(user.content)}`);
            channel.ack(user);
        });
    }catch(error){
        console.log(error)
    }
}

app.get("/consume",(req,res)=>{
    consumeData()
    res.send("Consuming messages from the queue...")
})
app.listen(PORT,()=> console.log("Server running at port " + PORT));