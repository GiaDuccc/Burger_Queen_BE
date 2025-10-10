import express, { Request, Response } from 'express';
import { branchController } from '~/controllers/branch.controller';
import { branchValidation } from '~/validations/branch.validation';

const Router = express.Router();

Router.route('/')
  .get( branchController.getAllBranch )
  .post( branchValidation.createNew, branchController.createNew );

Router.route('/:id')
  .get ( branchController.getBranchDetail );

export const branchRoute = Router;
