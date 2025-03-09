import { Request, Response } from "express";
import prisma from "../../prisma";

export default async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Delete the product
    await prisma.product.delete({
      where: { id }
    });

    res.status(200).json({ 
      message: "Product deleted successfully",
      id
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "An error occurred while deleting the product" 
    });
  }
}
