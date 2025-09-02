require('dotenv').config();
const express = require('express');
const healthRoutes = require('./routes/healthRoutes.js');

const app = express();

// Middlewares
app.post('/api/tatuador-clientes', authenticateToken,(req,res) => {

})

app.post('/api/create-tatuador', (req,res) => {
    const token = generateAccessToken({username: req.body.username});
    res.json(token);
})
const token = await res.json();
document.cookie = `token=${token}`;

app.use(express.json());

// Rotas
// Health
app.use('/health', healthRoutes);
// Login
// Registration
// Perfil
// Client
// Session
// Agenda
// Dashboard
// AI

module.exports = app;
