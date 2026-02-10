const amqp = require('amqplib');
const { json } = require('sequelize');

async function startConsumer() {
    // 1. connect to rabbitmq
    const connection = await amqp.connect('amqp://student:student123@localhost:5672')

    // 2. create a channel
    const channel = await connection.createChannel();

    // 3. ensure the queue exist
    // Consume from A–M queue
    const queueAM = 'welcome_email_A_M';
    await channel.assertQueue(queueAM, {durable: true});
    channel.consume(queueAM, (msg)=>{
        if(msg != null){
            // convert msg back to json
            const data = JSON.parse(msg.content.toString())
            console.log("Recieved from A-M Queue", data)
            // acknowledge the messsage
            channel.ack(msg);
        }
    })
    // consume from N-Z queue
    const queueNZ = 'welcome_email_N_Z';
    await channel.assertQueue(queueNZ, {durable:true});
    channel.consume(queueNZ, (msg)=>{
        if(msg != null){
            const data = JSON.parse(msg.content.toString());
            console.log("Recieved from N-Z Queue", data);
            channel.ack(msg);
        }
    })
}
startConsumer()

// // Flow:
// // - Connects to RabbitMQ → creates channel → asserts queue → listens for messages.
// // - Whenever a new user registers, the producer pushes a message.
// // - This consumer picks it up, logs it, and acknowledges it.