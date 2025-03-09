import { isValid, parse } from 'date-fns';
import { Request, Response } from "express";
import prisma from "../../prisma";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  params: {
    id: string;
  };
}

export default async function updateProduct(req: MulterRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const imageBuffer = req.file ? req.file.buffer : undefined;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Parse and validate the request body
    const bodyData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      quantity: req.body.quantity ? Number(req.body.quantity) : undefined,
      category: req.body.category !== undefined ? req.body.category === 'true' || req.body.category === true : undefined
    };

    // Process date if provided
    let dateObj: Date | undefined;
    if (req.body.date) {
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
    }

    // Build update data with only provided fields
    const updateData: any = {};
    if (bodyData.name !== undefined) updateData.name = bodyData.name;
    if (bodyData.description !== undefined) updateData.description = bodyData.description;
    if (bodyData.quantity !== undefined) updateData.quantity = bodyData.quantity;
    if (bodyData.price !== undefined) updateData.price = bodyData.price;
    if (dateObj !== undefined) updateData.date = dateObj;
    if (bodyData.category !== undefined) updateData.category = bodyData.category;
    if (imageBuffer !== undefined) updateData.image = imageBuffer;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ 
      message: "Product updated successfully", 
      product: {
        ...updatedProduct,
        image: updatedProduct.image ? "Binary image data" : null
      }
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "An error occurred while updating the product" 
    });
  }
}
