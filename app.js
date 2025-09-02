require('dotenv').config();
const express = require('express');
const healthRoutes = require('./routes/healthRoutes.js');

const app = express();

// Middlewares

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
