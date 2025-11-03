import express from 'express';
import { comboController } from '~/controllers/combo.controller';
import { authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';
import { comboValidation } from '~/validations/combo.validation';

const Router = express.Router();

Router.use(authenticateTokenAdmin);

Router.route('/')
  .get(comboController.getAllCombo)
  .post(authorizeRoles('manager'), comboValidation.createNew, comboController.createNew);

Router.route('/:id')
  .get(comboController.getComboDetail)
  .put(authorizeRoles('manager'), comboValidation.createNew, comboController.updateCombo)
  .delete(authorizeRoles('manager'), comboController.deleteCombo);

export const comboRoute = Router;