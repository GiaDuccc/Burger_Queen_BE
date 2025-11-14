import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { foodRoute } from './admin/food.routes';
import { companyRoute } from './admin/company.routes';
import { branchRoute } from './admin/branch.routes';
import { userRoute } from './admin/user.routes';
import { comboRoute } from './admin/combo.routes';
import { authRoute } from './admin/auth.routes';
import { employeeRoute } from './admin/employee.routes';
import { orderRoute } from './admin/order.routes';

const Router = express.Router();

Router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome to Burger Queen API v1' });
});

Router.get('/status', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: 'APIs_v1 is already running' });
});

Router.use('/admin/food', foodRoute);
Router.use('/admin/combo', comboRoute);
Router.use('/admin/company', companyRoute);
Router.use('/admin/branch', branchRoute);
Router.use('/admin/user', userRoute);
Router.use('/admin/auth', authRoute);
Router.use('/admin/employee', employeeRoute);
Router.use('/admin/order', orderRoute);
export const APIs_v1 = Router;
