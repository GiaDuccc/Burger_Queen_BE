import express from 'express';
import { employeeController } from '~/controllers/employee.controller';
import { authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';
import { employeeValidation } from '~/validations/employee.validation';  

const Router = express.Router();

Router.use(authenticateTokenAdmin);

Router.route('/')
  .get( employeeController.getAllEmployee )
  .post( authorizeRoles('admin', 'manager'), employeeValidation.createNew, employeeController.createNew );

Router.route('/:id')
  .get (authorizeRoles('admin', 'manager'), employeeController.getEmployeeDetail );

export const employeeRoute = Router;