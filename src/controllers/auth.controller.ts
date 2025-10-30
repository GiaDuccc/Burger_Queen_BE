import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { userModel } from '~/models/user.model';
import { userService } from '~/services/user.service';
import { token } from '~/utils/token';
import { employeeModel } from '~/models/employee.model';
import { authModel } from '~/models/auth.model';

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

    const accessToken = token.generateAccessToken({ userId: user._id?.toString() || "", role: userRole });

    const refreshToken = token.generateRefreshToken({ userId: user._id?.toString() || "", role: userRole });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu có HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await authModel.saveRefreshToken(user._id?.toString() || "", refreshToken);

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

const signOut = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log(req.user);
    await authModel.clearRefreshToken(req.user?.sub || "");
    res.status(StatusCodes.OK).json({ message: "Sign out successful" });
  } catch (error) {
    next(error);
  }
}

export const authController = {
  signIn,
  signUp,
  signOut
}