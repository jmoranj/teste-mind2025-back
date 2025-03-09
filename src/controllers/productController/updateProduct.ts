import { isValid, parse } from 'date-fns';
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../prisma";
import { product } from "../../schemas/Product";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  token?: JwtPayload | string;
  params: {
    id: string;
  };
}

export default async function updateProduct(req: MulterRequest, res: Response) {
  const { id } = req.params;
  
  try {
    // Parse the request data with validation
    const parsedData = product.parse({
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      category: req.body.category === 'true' || req.body.category === true
    });

    // Check if image is provided
    if (!req.file) {
      res.status(400).json({
        error: 'Image is required'
      });
      return;
    }

    // Verify file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      res.status(400).json({
        error: 'File must be an image'
      });
      return;
    }

    // Check if product exists
    const oldProduct = await prisma.product.findUnique({
      where: { id: id }
    });
      
    if (!oldProduct) {
      res.status(404).json({
        error: 'Product not found'
      });
      return;
    }

    // Parse date
    let dateObj: Date;
    try {
      dateObj = parse(req.body.date, 'dd/MM/yyyy', new Date());
      if (!isValid(dateObj)) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid date format. Please use DD/MM/YYYY" 
      });
      return;
    }

    // Get image buffer
    const imageBuffer = req.file.buffer;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: parsedData.name,
        description: parsedData.description || "",
        quantity: parsedData.quantity,
        price: parsedData.price,
        date: dateObj,
        category: parsedData.category,
        image: imageBuffer
      }
    });
    
    // Return the updated product (without binary image data)
    res.json({
      ...updatedProduct,
      image: updatedProduct.image ? "Binary image data" : null
    });
  } catch (error) {
    // Log the error
    console.error("Error updating product:", error);
    
    // Return error response
    res.status(400).json({ error: (error as Error).message });
  }
}
