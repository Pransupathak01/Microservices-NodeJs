 const amqp = require("amqplib");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4002;
app.use(express.json());

async function connectQueue(){
    try{
        connection = await amqp.connect("amqp://localhost:5672");
        channel =await connection.createChannel()
        await channel.assertQueue("test-queue")
        // channel.consume("test-queue", (data) =>{
        //     console.log(`${Buffer.from(data.content)}`);
        //     channel.ack(data);
        // })
    } catch(error){
        console.log(error)
    }
}
connectQueue();

async function consumeData (){
    try{
        channel.consume("test-queue",(data)=>{
             console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        });
    }catch(error){
        console.log(error)
    }
}

app.get("/consume-msg",(req,res)=>{
    consumeData()
    res.send("Consuming messages from the queue...")
    //res.json(`${Buffer.from(data.content)}`)

})
app.listen(PORT,()=> console.log("Server running at port " + PORT));

