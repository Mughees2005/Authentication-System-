// only routes
// POST /register
// POST /login
const {register, login} = require('../controllers/auth.controller');

async function routes(fastify){  //fastify plugin function
    fastify.post("/register", register)  //when someone send request on /auth/register tou phr controller call hoga
    fastify.post('/login', login) ////when someone send request on /auth/login tou phr controller call hoga
}

module.exports = routes;