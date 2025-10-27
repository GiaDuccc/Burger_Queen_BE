import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import ApiError from "~/utils/ApiError";
import { comboService } from "~/services/combo.service";
import { comboModel } from "~/models/combo.model";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCombo = await comboService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(newCombo);
  } catch ( error: any ) {
    next(error);
  }
}

const getAllCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const combos = await comboModel.getAllCombo();
    res.status(StatusCodes.OK).json(combos);
  } catch (error: any) {
    next(error);
  }
}

const getComboDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comboId = req.params.id;
    const combo = await comboModel.findOneById(comboId);
    if (!combo) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'Combo not found'));
    }
    res.status(StatusCodes.OK).json(combo);
  } catch (error: any) {
    next(error);
  }
}

const deleteCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comboId = req.params.id;
    const result = await comboModel.deleteCombo(comboId);
    res.status(StatusCodes.OK).json({ message: result });
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
}

const updateCombo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comboId = req.params.id;
    const updatedCombo = await comboService.updateCombo(comboId, req.body);
    res.status(StatusCodes.OK).json(updatedCombo);
  } catch (error: any) {
    next(error);
  }
}

export const comboController = {
  createNew,
  getAllCombo,
  getComboDetail,
  updateCombo,
  deleteCombo
}