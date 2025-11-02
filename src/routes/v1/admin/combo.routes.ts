import express from 'express';
import { comboController } from '~/controllers/combo.controller';
import { comboValidation } from '~/validations/combo.validation';

const Router = express.Router();

Router.route('/')
  .get(comboController.getAllCombo)
  .post(comboValidation.createNew, comboController.createNew);

Router.route('/:id')
  .get(comboController.getComboDetail)
  .put(comboValidation.createNew, comboController.updateCombo)
  .delete(comboController.deleteCombo);

export const comboRoute = Router;