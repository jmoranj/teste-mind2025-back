import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: JwtPayload | string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('No token provided');
      throw new Error('Token is missing');
    }

    console.log('Token received:', token);

    const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;

    console.log('Token decoded:', decoded);

    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    console.error('JWT Error:', err);
    res.status(401).send('Please authenticate');
  }
};