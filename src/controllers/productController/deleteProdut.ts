import { Request, Response } from "express";
import prisma from "../../prisma";

export default async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: id } // No Number() conversion needed for string UUID
    });

    // The image data is deleted automatically when the product is deleted

    // Delete the product
    await prisma.product.delete({ where: { id: id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
}
