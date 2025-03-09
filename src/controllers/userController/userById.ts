import { Request, Response } from "express";
import prisma from "../../prisma";

// Remove the Promise<void> return type (implicitly) to fix the TypeScript error
export default async function userById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id }, // No parseInt needed since ID is a UUID string
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
    return
  }
}
