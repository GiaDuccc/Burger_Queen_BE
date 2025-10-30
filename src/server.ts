import express, { Express, Request, Response } from 'express';
import cors from 'cors'
import { corsOptions } from './config/cors';
import { env } from './config/environment';
import { CONNECT_DB, CLOSE_DB } from './config/mongodb';
import exitHook from 'async-exit-hook';
import { APIs_v1 } from '~/routes/v1';
import cookieParser from 'cookie-parser';
import { errorHandlingMiddleware } from './middlewares/errorHandling.middleware';

const START_SERVER = () => {
  const app: Express = express();

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use('/v1/', APIs_v1);
  app.use(errorHandlingMiddleware);

  // Basic route
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Burger Queen API is running!',
      environment: env.BUILD_MODE,
      author: env.AUTHOR
    });
  });

  // Start server
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`🚀 Burger Queen Backend is running on port ${env.APP_PORT}`);
    console.log(`📍 Environment: ${env.BUILD_MODE}`);
    console.log(`🌐 Server URL: http://${env.APP_HOST}:${env.APP_PORT}`);
    console.log(`👨‍💻 Author: ${env.AUTHOR}`);
  });

  exitHook (async () => {
    console.log('Server is shutting down...');
    await CLOSE_DB();
    console.log('disconnecting from database...');
    console.log('Shutdown complete.');
    process.exit();
  });
};

(async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await CONNECT_DB();
    console.log('MongoDB database connected successfully.');
    START_SERVER();
    console.log('Server started successfully.');
  }
  catch (error) {
    console.error('Something went wrong', error);
  }
})();

