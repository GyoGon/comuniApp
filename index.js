import express from 'express';
import dotenv from 'dotenv';
import { handleError } from './src/utils/errorHandler.js';
import apiRoutes from './src/routes/indexRoutes.js';
const app = express();
const PORT = process.env.PORT || 8080;
dotenv.config();

app.use(express.json());

app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Middleware global para errores
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
