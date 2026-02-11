const {registerUser, loginUser} = require('../services/auth.services')

async function register(req, reply) {
    try{
        const {name, email, semester, year, age, cgpa, password} = req.body;
        const {user, token} = await registerUser(name, email, semester, year, age, cgpa, password)
        reply.send({
            message: "User registered",
            user: {id: user.id, email: user.email},
            token
        })

    }catch(error){
        reply.code(500).send({error: error.message})
    }
}

// async function login(req, reply) {
//     try{
//         const {email, password} = req.body;
//         const user = await loginUser(email, password)
//         reply.send({message: 'login done', user: user, token: token})
//     } catch(error){
//         reply.code(500).send({error: error.message});
//     } 
// }
async function login(req, reply) {
    try{
        const {email, password} = req.body;
        const {user, token} = await loginUser(email, password)
        reply.send({message: 'login done', user: user, token: token})
    } catch(error){
        reply.code(500).send({error: error.message});
    } 
}

module.exports = {register, login};