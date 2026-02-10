// RabbitMQ client library import
const amqp = require('amqplib')

// Main plugin function
async function rabbitmqPlugin(fastify, options) {
    // Connect to RabbitMQ server
    // URL format: protocol://username:password@host:port
    const connection = await amqp.connect('amqp://student:student123@localhost:5672');
    // Create a channel (gives you a “lane” to send/receive messages) 
    const channel = await connection.createChannel();

    // Make RabbitMQ available everywhere in Fastify
    // Now we can use fastify.rabbitmq in any route
    // - fastify.decorate('rabbitmq', {...}) attaches the connection and channel to Fastify, so you can use fastify.rabbitmq anywhere in routes
    fastify.decorate('rabbitmq', {
        channel, // For sending/receiving messages
        connection // The main connection
    });

    // Clean up when app stops  (app band hone pr connection close)
    fastify.addHook('onClose', async() =>{
        await channel.close();
        await connection.close();
    });

    console.log("RabbitMQ plugin loaded");
}
// plugn export
module.exports = rabbitmqPlugin;


// What This Does:
// Connects once when app starts
// Shares connection with all routes
// Cleans up automatically when app stops
// No need to connect in every route