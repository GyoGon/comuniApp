import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { handleError } from './src/utils/errorHandler.js';
import { sanitizeInput } from './src/middlewares/sanitizeMiddleware.js';
import swaggerSpec from './src/swagger/swaggerConfig.js';
import apiRoutes from './src/routes/indexRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080;
dotenv.config();

// Middleware
app.use(express.json());
app.use(sanitizeInput);

// Routes
app.use('/api', apiRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
  },
}));

// Swagger JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Global error handler middleware
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

export default app;
