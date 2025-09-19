import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const Router = express.Router();

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome to Burger Queen API v1' });
});

Router.get('/status', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 is already running' });
});

export const APIs_v1 = Router;
