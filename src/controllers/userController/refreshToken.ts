import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Remove the Promise<void> return type to avoid TypeScript errors
export default async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token missing' });
    return
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || "fallback-secret-key"
    const decoded = jwt.verify(refreshToken, secret as jwt.Secret);
    const userId = (decoded as any).userId;

    // Create new access token with the same secret
    const newAccessToken = jwt.sign(
      { userId: userId }, 
      secret as jwt.Secret,
      { expiresIn: "1h" }
    );
    
    res.json({ token: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: 'Invalid refresh token' });
    return
  }
}
