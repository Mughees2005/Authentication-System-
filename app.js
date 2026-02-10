const fastify = require('fastify')()
const sequelize = require('./config/db');
const Student = require('./models/student');
const {initRabbitMQ} = require('./services/queue_services/rabbitmq_connection');
// const Student = require('./models/student')

fastify.register(require('@fastify/formbody'))

fastify.register(require('./routes/auth.route'), {prefix: '/auth'})

async function setupDatabase() {
    try{
        // Initialize RabbitMQ
        await initRabbitMQ();

        await sequelize.authenticate();
        console.log('Database connected');

        await sequelize.sync();
        console.log('Tables Synced');

        // registering routes
        fastify.register(require('./routes/auth.route'));

        // starting server
        fastify.listen({port:3000}, err =>{
            if (err) throw new err 
            console.log(`Server listening on ${fastify.server.address().port}`)
        })
    }catch (error){
        console.log('Database connection failed', error);
    }
}
setupDatabase();


const path = require('path');
const fastifyStatic = require('@fastify/static');

// Serve static files from "public" folder
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
});

// get all users
fastify.get('/users', async (req, reply) =>{
    try{
        const students = await Student.findAll();
        reply.send(students);
    }catch (error){
        reply.code(500).send({error: error.message});
    }
})

// get user by id
fastify.get('/user/:id', async(req, reply) =>{
    try{
        const student = await Student.findByPk(req.params.id);

        if(!student){return reply.code(404).send({error: error.message})};
        reply.send(student);
    }catch (error){
        reply.code(500).send({error: error.message});
    }
})

// Summary - What's Working:
// PostgreSQL Docker Container → Port 5440
// Adminer Database GUI → Port 8080
// RabbitMQ → Port 5672
// Fastify App → Port 3000