import { isValid, parse } from 'date-fns';
import { Request, Response } from "express";
import prisma from "../../prisma";
import { ProductSchema, product } from "../../schemas/Product";

interface MulterRequest extends Request{
  file?: Express.Multer.File;
}
export default async function addProduct(req: MulterRequest, res: Response): Promise<void>{
  try {
    const imageBuffer = req.file ? req.file.buffer : undefined

    const parsedData: ProductSchema = product.parse({
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity)
    });

    let dateObj: any

    try {
      dateObj = parse(req.body.date, 'dd/MM/yyyy', new Date());
      if (!isValid(dateObj)) {
        throw new Error("Invalid date");
      }
    } catch (error) {
      res.status(400).json({ 
        error: "Invalid date format. Please use DD/MM/YYYY" 
      });

    }

    const newProduct = await prisma.product.create({
      data: {
        name: parsedData.name,
        description: parsedData.description,
        quantity: parsedData.quantity,
        price: parsedData.price,
        date: dateObj,
        category: parsedData.category,
        image: imageBuffer, // Store the binary image data directly
        userId: req.body.userId // Or get from authentication context
      }
    });

    res.status(201).json({ 
      message: "Product added successfully", 
      product: {
        ...newProduct,
        image: newProduct.image ? "Binary image data" : null // Don't send binary data in response
      }
    });
  } catch (error: any) {
    console.error("Error adding product:", error);
    res.status(400).json({ error: error.message });
  }
  

}