require('dotenv').config();
const express = require('express');
const healthRoutes = require('./routes/healthRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

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
