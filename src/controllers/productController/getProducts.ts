import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../../middleware/auth";
import prisma from "../../prisma";

export default async function getProducts(req: Request, res: Response): Promise<void> {
  const { token } = req as CustomRequest;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = token as JwtPayload;
    const userId = decoded.userId; // Assuming your token has userId field

    const products = await prisma.product.findMany({
      where: { userId: userId }
    });

    // Don't send binary image data in the response
    const productsWithoutImageData = products.map(product => ({
      ...product,
      image: product.image ? "Binary image data" : null
    }));

    res.json(productsWithoutImageData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
