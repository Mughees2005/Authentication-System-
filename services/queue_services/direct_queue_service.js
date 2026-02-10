const {connectRabbitMQ} = require('./rabbitmq_connection');

// direct exchange
async function queueWelcomeEmail(studentData) {
  try {
    const channel = await connectRabbitMQ();
    // Calls connectRabbitMQ() → ensures a connection and channel to RabbitMQ exist.
    // await means it waits until the channel is ready before continuing.
    const exchangeName = 'email_exchange';
    await channel.assertExchange(exchangeName, 'direct', {durable:true}); // // durable:true → exchange will not delete when RabbitMQ restart
    // Decide queue based on first letter of name
    const firstLetter = studentData.name[0].toUpperCase();
    let queueName, routingKey;
    if(firstLetter >= "A" && firstLetter<= "M"){
      queueName = 'welcome_email_A_M'
      routingKey = 'welcome_email_A_M'
    }else{
      queueName = 'welcome_email_N_Z'
      routingKey = 'welcome_email_N_Z'
    }

    await channel.assertQueue(queueName, {
      durable: true
    });
    // Checks if the queue named welcome_emails exists.
    // If not, it creates it.
    // durable: true means the queue will survive RabbitMQ restarts (persistent).

    await channel.bindQueue(queueName, exchangeName, routingKey);


    const message = {
      type: 'WELCOME_EMAIL',
      to: studentData.email,
      name: studentData.name,
      timestamp: new Date().toISOString()
    };
//     type → identifies the kind of message.
//     to → recipient’s email.
//     name → student’s name.
//     timestamp → current time in ISO format.
    
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)), {persistent: true})
    // Sends the message into the welcome_emails queue.
    // Buffer.from(JSON.stringify(message)) converts the object into bytes RabbitMQ can store.
    // { persistent: true } → ensures the message is saved to disk, not lost if RabbitMQ restarts.
    console.log(`Queued email for: ${studentData.email}`);
    return true;
    // Logs confirmation that the message was queued.
    // Returns true to indicate success.
    
  } catch (error) {
    console.log(`Email queue failed: ${error.message}`);
    return false;
  }
}

module.exports = { 
  queueWelcomeEmail
};





// fanout exchange
// const exchangeName = 'email_exchange';

// async function queueCategorizedEmail(studentData) {
//     try{
//         const channel = await connectRabbitMQ();
        
//         // Exchange define
//         await channel.assertExchange(exchangeName, 'direct', {durable: true});
//         // 2. Decide queue based on first letter of name
//         const firstLetter = studentData.name[0].toUpperCase();
//         let queueName, routingKey
//         if(firstLetter >= "A" && firstLetter <= "M"){
//             queueName = 'welcome_emails';
//             routingKey = 'welcome_emails';
//         } else{
//             queueName = 'welcome_emails1';
//             routingKey = 'welcome_emails1';
//         }
//         // 3. Queue assert + bind
//         await channel.assertQueue(queueName, {durable:true});
//         await channel.bindQueue(queueName, exchangeName, routingKey);

//         // build msg
//         const message = {
//             type: 'WELCOME_EMAIL',
//             to: studentData.email,
//             name: studentData.name,
//             timestamp: new Date().toISOString()
//         }

//         // 5. Publish to exchange with chosen routing key
//         channel.publish(
//             exchangeName,
//             routingKey, 
//             Buffer.from(JSON.stringify(message)),
//             {persistent: true}
//         );
//         console.log(`Queued to ${queueName}: ${studentData.email}`);
//         return true;
//     }catch (error){

//     }
// }





// - queueWelcomeEmail function
// - Calls connectRabbitMQ() to ensure connection.
// - assertQueue('welcome_emails', { durable: true }) → makes sure the queue exists and survives restarts.
// - Builds a message object with email, name, timestamp.
// - Converts it to bytes (Buffer.from(JSON.stringify(message))).
// - Sends it into the queue (sendToQueue).


// // Function 1: queueWelcomeEmail
// // -----------------------------
// // Category: welcome_emails
// async function queueWelcomeEmail(studentData) {
//   try {
  //     const channel = await connectRabbitMQ();

  //     // Define exchangeName here
  //     const exchangeName = 'email_exchange';  
  //     await channel.assertExchange(exchangeName, 'direct', { durable: true });
  
  //     const queueName = 'welcome_emails';
  //     const routingKey = 'welcome_emails';
  
  //     await channel.assertQueue(queueName, { durable: true });
  //     await channel.bindQueue(queueName, exchangeName, routingKey);
  
  //     const message = {
    //       type: 'WELCOME_EMAIL',
//       to: studentData.email,
//       name: studentData.name,
//       timestamp: new Date().toISOString()
//     };

//     channel.publish(
  //       exchangeName,   // ✅ now defined
//       routingKey,
//       Buffer.from(JSON.stringify(message)),
//       { persistent: true }
//     );

//     console.log(`Queued email for: ${studentData.email}`);
//     return true;

//   } catch (error) {
  //     console.log(`Email queue failed: ${error.message}`);
//     return false;
//   }
// }

// async function queueWelcomeEmail1(studentData) {
//     try{
  //         const channel = await connectRabbitMQ();
  
  //         // defining direct exchange
//         const exchangeName = 'email_exchange';
//         await channel.assertExchange(exchangeName, 'direct', {durable:true})

//         //  Using manually created queue
//         const queueName = 'welcome_emails1';
//         const routingKey = 'welcome_emails1';

//         await channel.assertQueue(queueName, {durable:true})
//         await channel.bindQueue(queueName, exchangeName, routingKey)

//         const message = {
  //             type: 'WELCOME_EMAIL_1',
//             to: studentData.email,
//             name: studentData.name,
//             timestamp: new Date().toISOString()
//         }

//         // Publish message to exchange instead of sendToQueue
//         channel.publish(
  //             exchangeName,
  //             routingKey, 
  //             Buffer.from(JSON.stringify(message)),
  //             {persistent: true}
  //         )
  
//         console.log(`Queued to welcome_email_1 for: ${studentData.email}`);
//         return true;


//     } catch (error){
//         console.log(`Email queue failed: ${error.message}`);
//         return false;
//     }
// }

// - initRabbitMQ function
// - Calls connectRabbitMQ() at app startup







// const fancoutExchange = 'broadcast_exchange';
// async function queueFanoutEmail(studentData) {
//     try{
//         const channel = await connectRabbitMQ();
//         // 1. Fanout exchange define
//         await channel.assertExchange(fancoutExchange, 'fanout', {durable:true});

//         // 2. Queues bind to fanout exchange
//         await channel.assertQueue('welcome_emails', {durable:true});
//         await channel.assertQueue('welcome_emails1', {durable:true});

//         await channel.bindQueue('welcome_emails', fancoutExchange, '');
//         await channel.bindQueue('welcome_emails1', fancoutExchange, '');

//         // 3. Build message
//     const message = {
//       type: 'WELCOME_EMAIL',
//       to: studentData.email,
//       name: studentData.name,
//       timestamp: new Date().toISOString()
//     };

//     // 4. Publish (routing key ignored in fanout)
//     channel.publish(
//       fanoutExchange,
//       '',
//       Buffer.from(JSON.stringify(message)),
//       { persistent: true }
//     );
//     console.log(`Broadcasted to all queues: ${studentData.email}`);
//     return true;

//     }catch(error){

//     }
// }