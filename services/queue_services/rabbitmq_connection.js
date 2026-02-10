const amqp = require('amqplib');

let channel = null;
let connection = null;

// - connectRabbitMQ function
// - Checks if a channel already exists → reuse it.
// - If not, connects to RabbitMQ (amqp.connect(...)).
// - Creates a channel (connection.createChannel()).

async function connectRabbitMQ() {
  if (channel) return channel;
  try {
    connection = await amqp.connect('amqp://student:student123@localhost:5672');
    channel = await connection.createChannel();
    console.log('RabbitMQ service connected');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection failed:', error.message);
    throw error;
  }
}

async function initRabbitMQ() {
  try {
    const channel = await connectRabbitMQ(); 
    console.log('RabbitMQ service initialized');
    return channel;
  } catch (error) {
    console.error('RabbitMQ initialization failed:', error.message);
    throw error;
  }
}

module.exports = {
    connectRabbitMQ,
    initRabbitMQ
};