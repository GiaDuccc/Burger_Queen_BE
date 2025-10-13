import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { foodRoute } from './food.routes';
import { companyRoute } from './company.routes';
import { branchRoute } from './branch.routes';
import { userRoute } from './user.routes';
import { comboRoute } from './combo.routes';
import { authRoute } from './auth.routes';
import { employeeRoute } from './employee.routes';

const Router = express.Router();

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome to Burger Queen API v1' });
});

Router.get('/status', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 is already running' });
});

Router.use('/food', foodRoute);
Router.use('/combo', comboRoute);
Router.use('/company', companyRoute);
Router.use('/branch', branchRoute);
Router.use('/user', userRoute);
Router.use('/auth', authRoute);
Router.use('/employee', employeeRoute)
export const APIs_v1 = Router;
