import { Request, Response } from "express";
import prisma from "../../prisma";

export default async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    // Extract query parameters for filtering
    const { 
      name, 
      category, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '10'
    } = req.query;

    // Build filter object
    const where: any = {};
    
    // Add filters if provided
    if (name) {
      where.name = {
        contains: String(name)
      };
    }
    
    if (category !== undefined) {
      where.category = category === 'true';
    }
    
    if (minPrice) {
      where.price = {
        ...where.price,
        gte: Number(minPrice)
      };
    }
    
    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: Number(maxPrice)
      };
    }

    // Parse pagination params
    const pageNumber = Math.max(1, parseInt(String(page), 10));
    const pageSize = Math.max(1, parseInt(String(limit), 10));
    const skip = (pageNumber - 1) * pageSize;

    // Get total count for pagination info
    const total = await prisma.product.count({ where });

    // Get products with pagination and sorting
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [String(sortBy)]: order === 'asc' ? 'asc' : 'desc'
      },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Map products to remove binary data from response
    const formattedProducts = products.map(product => ({
      ...product,
      image: product.image ? "Binary image data" : null
    }));

    res.status(200).json({
      products: formattedProducts,
      pagination: {
        total,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "An error occurred while fetching products" 
    });
  }
}
