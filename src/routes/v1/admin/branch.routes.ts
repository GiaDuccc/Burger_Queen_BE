import express from 'express';
import { branchController } from '~/controllers/branch.controller';
import { authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';
import { branchValidation } from '~/validations/branch.validation';

const Router = express.Router();

Router.route('/')
  .get( authenticateTokenAdmin, authorizeRoles('admin', 'manager'), branchController.getAllBranch )
  .post( branchValidation.createNew, branchController.createNew );

Router.route('/getBranchByCity/')
  .get( branchController.getBranchByCity );

Router.route('/getAllCities')
  .get( branchController.getAllCities );

Router.route('/:id')
  .get ( branchController.getBranchDetail );

export const branchRoute = Router;
