import { Request, Response } from "express";

export default async function logout(req: Request, res: Response): Promise<void> {
  res.clearCookie('acessToken');
  res.status(200).json({ message: 'Logged out successfully' });
}