import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { employeeModel } from '~/models/employee.model';
import { employeeService } from '~/services/employee.service';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newEmployee = await employeeService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(newEmployee);
  } catch (error) {
    next(error);
  }
}

const getAllEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employees = await employeeModel.getAllEmployee();
    res.status(StatusCodes.OK).json(employees);
  } catch (error) {
    next(error);
  }
}

const getEmployeeDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.params.id;
    const employee = await employeeService.getEmployeeDetail(employeeId);
    res.status(StatusCodes.OK).json(employee);
  } catch (error) {
    next(error);
  }
}

const getAllEmployeePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query.filter as string || "";
    const branchId = req.query.branchId as string || "";

    const employees = await employeeModel.getAllEmployeePage(filter, branchId);
    res.status(StatusCodes.OK).json(employees);
  } catch (error) {
    next(error);
  }
}

const getEmployeeByBranchId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.branchId;
    const employees = await employeeModel.getEmployeeByBranchId(branchId);
    res.status(StatusCodes.OK).json(employees);
  } catch (error) {
    next(error);
  }
}

export const employeeController = {
  getAllEmployee,
  createNew,
  getEmployeeDetail,
  getAllEmployeePage,
  getEmployeeByBranchId
}