const amqp = require("amqplib");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());

var channel, connection;
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel()
        await channel.assertQueue("test-queue")

    } catch (error) {
        console.log(error)
    }
}
connectQueue()

async function sendData(data) {
    try {
        await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        console.log("A message is sent to queue");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
app.get("/send-msg", (req, res) => {

    const data = {
        title: "Six of Crows",
        author: "Leigh Burdugo"
    }
    sendData(data);
    res.send("Message Sent");
})
app.listen(PORT, () => console.log("Server running at port " + PORT)); 