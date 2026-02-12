# StudentConnect — Fastify Authentication System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-v5-blue)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-auth-orange)](https://jwt.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-message%20queue-red)](https://www.rabbitmq.com/)

A compact Fastify backend implementing JWT-based authentication, PostgreSQL persistence via Sequelize, and RabbitMQ-based welcome-email queuing. Built with an MVC structure and Docker Compose for easy local development.

---

## 💡 Why This Project?

I built this project to **master the fundamentals of backend development** — 
authentication, database design, and asynchronous communication.

Key learning goals:
- Implement **JWT authentication** with proper password hashing
- Design a **clean MVC architecture** with separation of concerns
- Integrate **RabbitMQ** for message-driven workflows
- **Containerize** services with Docker for consistent development

This project demonstrates my ability to build **production-ready APIs** 
using modern Node.js tools and industry best practices.

---

## Features ✨
- ✅ User registration & login with bcrypt password hashing
- ✅ JWT authentication with configurable expiration
- ✅ PostgreSQL persistence via Sequelize ORM
- ✅ RabbitMQ direct-exchange producer for welcome-email messages
- ✅ Example consumer that processes queued messages
- ✅ Static `public/` pages for quick manual testing (login/register)
- ✅ Docker Compose stack: Postgres, Adminer, RabbitMQ

---

## Tech Stack 🧰

| Layer | Technology |
|---|---|
| Server | Fastify |
| Language | Node.js |
| ORM | Sequelize |
| Database | PostgreSQL |
| Auth | bcrypt + JSON Web Tokens (JWT) |
| Queue | RabbitMQ (amqplib) |
| Orchestration | Docker / docker-compose |
| Static UI | Plain HTML (in `public/`) |

---

## Project Structure (tree) 📁
```
.
├─ app.js
├─ docker-compose.yml
├─ package.json
├─ readme.md
├─ config/
│  └─ db.js
├─ consumers/
│  └─ direct_consumer.js
├─ controllers/
│  └─ auth.controller.js
├─ models/
│  ├─ index.js
│  └─ student.js
├─ plugins/
│  └─ rabbitmq.js
├─ public/
│  ├─ login.html
│  └─ register.html
├─ routes/
│  └─ auth.route.js
├─ services/
│  ├─ auth.services.js
│  └─ queue_services/
│     ├─ direct_queue_service.js
│     └─ rabbitmq_connection.js
```

---

## Prerequisites & Installation

### With Docker (recommended)
1. Install Docker Desktop (Windows) and enable WSL2 if prompted.
2. From project root run:
```bash
docker compose up -d
```
3. Install Node.js dependencies (optional if running inside container):
```bash
npm install
```
4. Run the app locally (host):
```bash
node app.js
```

Notes:
- Adminer (DB GUI): http://localhost:8080
- RabbitMQ management UI: http://localhost:15672

### Without Docker (local services)
1. Start a PostgreSQL instance and create the database (see env vars below).
2. Start RabbitMQ (with management plugin) locally.
3. Export environment variables (Windows PowerShell example):
```powershell
$env:POSTGRES_HOST = 'localhost'
$env:POSTGRES_PORT = '5432'
$env:POSTGRES_DB = 'student_db'
$env:POSTGRES_USER = 'postgres'
$env:POSTGRES_PASSWORD = 'your_password'
$env:JWT_SECRET = 'your_jwt_secret'
$env:RABBITMQ_URL = 'amqp://user:pass@localhost:5672'
```
4. Install deps and start:
```bash
npm install
node app.js
```

---

## Environment Variables
Set these in your environment (or a `.env` file with your chosen loader).

| Key | Example | Purpose |
|---|---|---|
| POSTGRES_HOST | localhost | PostgreSQL host |
| POSTGRES_PORT | 5440 | PostgreSQL port (mapped) |
| POSTGRES_DB | student_db | Database name |
| POSTGRES_USER | postgres | DB user |
| POSTGRES_PASSWORD | example_password | DB password |
| JWT_SECRET | replace_with_secure_secret | JWT signing secret |
| JWT_EXPIRES_IN | 24h | Token expiration (e.g. 1h, 24h) |
| RABBITMQ_URL | amqp://guest:guest@localhost:5672 | RabbitMQ connection URL |

Replace defaults with secure values for production.

---

## API Documentation

Base URL: `http://localhost:3000`

### POST /auth/register
- Description: Register a new student, hash password and publish a welcome message to RabbitMQ.
- Route file: [routes/auth.route.js](routes/auth.route.js)

Request (JSON):
```json
POST /auth/register
{
  "name": "Alice",
  "email": "alice@example.com",
  "semester": 3,
  "year": 2024,
  "age": 20,
  "cgpa": 3.8,
  "password": "secret123"
}
```

Success (201):
```json
{
  "message": "User registered",
  "user": { "id": 1, "email": "alice@example.com" },
  "token": "<JWT_TOKEN>"
}
```

### POST /auth/login
- Description: Authenticate user and return JWT.

Request:
```json
POST /auth/login
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Success (200):
```json
{
  "message": "login done",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "token": "<JWT_TOKEN>"
}
```

### GET /users
- Description: Retrieve all students. (DB access required)

### GET /user/:id
- Description: Retrieve a single student by id.

Notes:
- Controllers live in `controllers/` and business logic in `services/` (e.g. `services/auth.services.js`).

---

## RabbitMQ & Queues (direct exchange)

- Exchange: `email_exchange` (type: `direct`)
- Example routing keys / queues: `welcome_email_A_M`, `welcome_email_N_Z` (based on name letter)
- Producer: `services/queue_services/direct_queue_service.js` — called on user registration.
- Consumer example: `consumers/direct_consumer.js` — subscribes to the queues and logs/handles messages.

---

## Docker Containers & Ports

Defined in `docker-compose.yml`.

| Service | Image | Ports | Purpose |
|---|---|---:|---|
| postgres | postgres:latest | 5440:5432 | PostgreSQL DB (mapped port 5440) |
| adminer | adminer:latest | 8080:8080 | Adminer DB GUI |
| rabbitmq | rabbitmq:3-management | 5672:5672, 15672:15672 | RabbitMQ broker + management UI |

Access:
- Adminer: http://localhost:8080
- RabbitMQ UI: http://localhost:15672

---

## 📸 Project Demo

|-------------------|-------------------|
| ![Docker](screenshots/docker-containers.png) | ![Postman](screenshots/postman-login.png) |
---

## Challenges Faced & Learnings 🧩

- Managing RabbitMQ connection lifecycle and ensuring the producer has an active channel before publishing.
- Designing message routing strategies using a direct exchange for simple targeted email queues.
- Ensuring Sequelize sync runs reliably before the server accepts requests.
- Security: using `bcrypt` for password hashing and `JWT` for stateless authentication.

---

## Author ✍️

**Mughees Saleem**  
📍 *Karachi, Pakistan*  

Backend Developer | Data Scientist Enthusiast  

<div align="center">
  <a href="mailto:mughees_saleem@outlook.com" target="_blank">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
  </a>
  <a href="https://www.linkedin.com/in/mughees-saleem-/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="https://github.com/Mughees2005" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-333?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
</div>
