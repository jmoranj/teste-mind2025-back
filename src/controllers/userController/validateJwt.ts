import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

const validateJwt: RequestHandler = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token must be provided' });
    return; // Just return without returning the result
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret-key"
    const decoded = jwt.verify(token, secret as jwt.Secret);
    res.json({ valid: true, decoded });
  } catch (error) {
    console.error('JWT Validation Error:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

export default validateJwt;
