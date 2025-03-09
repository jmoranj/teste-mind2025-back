import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ZodError } from "zod";
import prisma from "../../prisma";
import { registerSchema } from "../../schemas/User";

export default async function registerUser(req: Request, res: Response) {
  try {
    // Parse and validate request data
    const userData = registerSchema.parse(req.body); // Use imported schema

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      res.status(400).json({
        error: 'Email already in use'
      });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Return the created user
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
      return;
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}
