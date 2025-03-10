import { Request, Response } from "express";
import prisma from "../../prisma";

export default async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params; // Get userId from URL parameters
    
    // Verify the id exists
    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      // ⬆️ Add  here to prevent further execution
    }

    // Fetch products for this user
    const products = await prisma.product.findMany({
      where: { userId: id }
    });

    res.json(products);
    // ⬆️ Add  here to be explicit about ending execution
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: (error as Error).message });
    // ⬆️ Add  here as well
  }
}
