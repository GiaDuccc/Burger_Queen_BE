import express from 'express';
import { employeeController } from '~/controllers/employee.controller';
import { employeeValidation } from '~/validations/employee.validation';  

const Router = express.Router();

Router.route('/')
  .get( employeeController.getAllEmployee )
  .post( employeeValidation.createNew, employeeController.createNew );

Router.route('/:id')
  .get ( employeeController.getEmployeeDetail );

export const employeeRoute = Router;