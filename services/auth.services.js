const bcrypt = require('bcrypt');
const Student = require('../models/student')
const jwt = require('jsonwebtoken')
const {queueWelcomeEmail} = require('./queue_services/direct_queue_service')

const JWT_SECRET = process.env.JWT_SECRET || 'fastify-auth-secret-key-2024';

async function registerUser(name, email, semester, year, age, cgpa, password) {
        // check user exist or not
        const userExists  = await Student.findOne({ where: {email} });
        if (userExists ){
            throw new Error('User already exist');
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10)
        // hash convert user plain password into encrypted form

        // create user
        const user = await Student.create({name, email, semester, year, age, cgpa, password:hashed})

        // direct Queue welcome email (RabbitMQ)
        queueWelcomeEmail({
            email: user.email,
            name: user.name,
            semester: user.semester
        })
        // fanout queue welcome email
        // queueFanoutEmail({
        //     email: user.email,
        //     name: user.name,
        //     semester:user.semester
        // })
        
        // generating jwt token
        const token = jwt.sign(
            {id: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: "24h"}
        )
        
        return {user, token}
}

async function loginUser(email, password) {
    // finding user
    const user = await Student.findOne({where: {email}})
    if(!user)throw new Error('User not found');

    // match password
    const valid = await bcrypt.compare(password, user.password); 
    if(!valid) throw new Error('Invalid password');

    const token = jwt.sign(
        {id: user.id, email: user.email},
        JWT_SECRET,
        {expiresIn: '24h'}
    )

    return {user: {id: user.id, name: user.name, email: user.email}, token};

}
module.exports = {registerUser, loginUser};
// module.exports = {loginUser};




// docker
// run postgres through docker
// why docker imp and what problem does it solve