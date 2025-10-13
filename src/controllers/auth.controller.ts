import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { userModel } from '~/models/user.model';
import { userService } from '~/services/user.service';
import { token } from '~/utils/token';
import { employeeModel } from '~/models/employee.model';

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.signIn(username, password);
    let userRole = "";
    if (user.userType == 'employee') {
      const employee = await employeeModel.findEmployeeByUserId(user._id?.toString() || "");
      userRole = employee?.role || "";
    }
    else userRole = "none";

    const accessToken = token.generateAccessToken({ id: user._id?.toString() || "", role: userRole });

    const refreshToken = token.generateRefreshToken({ id: user._id?.toString() || "", role: userRole });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu có HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Generate JWT token
    res.status(StatusCodes.OK).json({
      introduce: `Welcome back ${user.fullName}!`,
      message: 'Sign in success',
      accessToken
    });

  } catch (error: any) {
    next(error);
  }
}

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({
      introduce: `Welcome ${newUser.fullName}!`,
      status: 'success',
      message: `You have successfully registered account ${newUser.email}`
    });
  } catch (error: any) {
    next(error);
  }
}

export const authController = {
  signIn,
  signUp
}