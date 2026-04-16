require('dotenv').config();
const express = require('express');
const healthRoutes = require('./routes/healthRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const perfilRoutes = require('./routes/perfilRoutes.js');
const imageRoutes = require('./routes/imageRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const sessionClienteRoutes = require('./routes/sessionsClienteRoutes.js');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes.js')
const dashboardRoutes = require('./routes/dashboardRoutes.js')
const styleRoutes = require('./routes/styleRoutes.js')
const app = express();
const setupSwagger = require('./swagger.js')
const swaggerUI = require('swagger-ui-express')
const generateRoutes = require('./routes/generateRoutes.js')
const photoRoutes = require('./routes/photoRoutes.js')
const generatedImages = require('./routes/aiGalleryRoutes.js')
const bairroRoutes = require('./routes/bairroRoutes.js')
const tatuadorRoutes = require('./routes/tatuadorRoutes.js')
const reviewRoutes = require('./routes/reviewRoutes.js')
const favoritoRoutes = require('./routes/favoritoRoutes.js')

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8081",
      "http://127.0.0.1:8081",
      "http://localhost:8082",
      "http://127.0.0.1:8082",
      "http://localhost:19006",
      "http://127.0.0.1:19006",
      "http://10.0.2.2:8081", // Android emulador
      "exp://127.0.0.1:8081", // Expo
      "exp://localhost:8081"
    ];

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
app.use('/api/perfil', perfilRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/style', styleRoutes)
// Client
app.use('/api/client', clientRoutes)
// Session
app.use('/api/sessions', sessionRoutes);
// Agenda
// Dashboard
app.use('/api/dashboard', dashboardRoutes);
// AI
app.use('/api/generate', generateRoutes);
// Galeria
app.use('/api/galeria', photoRoutes);
// Galeria de Ia
app.use('/api/galeria-ia', generatedImages);

//Mobile
app.use('/api/mobile/sessions', sessionClienteRoutes)

app.use('/api/bairro', bairroRoutes)
app.use('/api/tatuador', tatuadorRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/favoritos', favoritoRoutes)

app.use('/docs', swaggerUI.serve, swaggerUI.setup(setupSwagger))
module.exports = app;
