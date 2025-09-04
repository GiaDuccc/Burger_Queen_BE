import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Burger Queen Backend API!',
    timestamp: new Date().toISOString(),
    environment: process.env.BUILD_MODE || 'development'
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Burger Queen Backend is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.BUILD_MODE || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});
