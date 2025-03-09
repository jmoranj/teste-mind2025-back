import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../../prisma";

// Define validation schema for login data
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Remove the Promise<void> return type to fix the TypeScript error
export default async function login(req: Request, res: Response) {
  console.log("📝 Login attempt with email:", req.body.email);
  
  try {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists
    if (!user) {
      console.log("❌ Login failed: User not found with email:", email);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("❌ Login failed: Incorrect password for user:", email);
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("⚠️ WARNING: JWT_SECRET not set in environment variables");
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "HARDCODED-SECRET-FOR-TESTING-123456789", // Use this exact string
      { expiresIn: "24h" }
    );
    console.log("✅ Login successful for user:", email);
    console.log("🔑 JWT token generated successfully");

    // Return user info and token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: "Validation error", 
        details: error.errors 
      });
      return;
    }
    
    // Handle other errors
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "An error occurred during login" 
    });
  }
}
