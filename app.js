require('dotenv').config();
const express = require('express');
const healthRoutes = require('./routes/healthRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Middlewares

app.use(express.json());

// Rotas
// Health
app.use('/health', healthRoutes);
// Login
// Registration
// Perfil
app.use('/api/user', userRoutes);
// Client
// Session
// Agenda
// Dashboard
// AI

module.exports = app;
