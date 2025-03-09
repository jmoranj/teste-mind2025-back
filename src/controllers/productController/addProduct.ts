import { isValid, parse } from 'date-fns';
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../../middleware/auth";
import prisma from "../../prisma";
import { product } from "../../schemas/Product";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  token?: JwtPayload | string;
}

export default async function addProduct(req: MulterRequest, res: Response): Promise<void> {
  console.log('===================== ADD PRODUCT REQUEST START =====================');
  console.log(`📦 Add product request received: ${req.method} ${req.originalUrl}`);
  
  // Log auth header and token info
  console.log('🔐 Auth header:', req.headers.authorization ? 'Present' : 'MISSING');
  console.log('🔒 Token from request object:', req.token ? 'Present' : 'MISSING');
  
  // Log request body (excluding large binary data)
  console.log('📄 Request body:', JSON.stringify({
    ...req.body,
    // Redact any potentially large or sensitive fields
    image: req.file ? `[File: ${req.file.originalname}]` : 'No file'
  }, null, 2));
  
  try {
    console.log('🔍 Attempting to extract user token...');
    // Get user from token (using your auth.ts approach)
    const reqWithToken = req as CustomRequest;
    console.log('🧩 Request as CustomRequest:', {
      hasToken: !!reqWithToken.token,
      tokenType: reqWithToken.token ? typeof reqWithToken.token : 'N/A'
    });
    
    const { token } = reqWithToken;
    console.log('🎫 Extracted token:', token ? 'Present' : 'MISSING');
    
    const decoded = token as JwtPayload;
    console.log('🔓 Decoded token:', decoded ? {
      ...decoded,
      // Show key properties we're looking for
      hasUserId: !!decoded.userId,
      userId: decoded.userId,
      // If userId is missing but id exists, that could be the issue
      hasId: !!decoded.id,
      id: decoded.id
    } : 'UNDEFINED');
    
    // Extract image if available
    const imageBuffer = req.file ? req.file.buffer : undefined;
    console.log(`🖼️ Image file ${imageBuffer ? `provided (${req.file?.originalname})` : 'not provided'}`);

    // Parse and validate product data
    console.log('📊 Validating product data...');
    const parsedData = product.parse({
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      category: req.body.category === 'true' || req.body.category === true
    });
    console.log('✅ Product data validated successfully');

    // Parse date from DD/MM/YYYY format
    console.log(`📅 Parsing date: ${req.body.date}`);
    let dateObj: Date;
    try {
      dateObj = parse(req.body.date, 'dd/MM/yyyy', new Date());
      if (!isValid(dateObj)) {
        throw new Error("Invalid date");
      }
      console.log(`✅ Date parsed successfully: ${dateObj.toISOString()}`);
    } catch (error) {
      console.error(`❌ Date parsing error:`, error);
      res.status(400).json({ 
        error: "Invalid date format. Please use DD/MM/YYYY" 
      });
      return;
    }

    // CRITICAL FIX: Check if we have a userId before using it
    const userId = decoded?.userId || decoded?.id || req.body.userId;
    console.log(`👤 Using userId: ${userId || 'MISSING'}`);
    
    if (!userId) {
      console.error('❌ ERROR: No userId available from token or request body');
      res.status(400).json({ error: "User ID is required to create a product" });
      return;
    }

    // Create product in database
    console.log('🏗️ Creating product in database...');
    const newProduct = await prisma.product.create({
      data: {
        name: parsedData.name,
        description: parsedData.description || "",
        quantity: parsedData.quantity,
        price: parsedData.price,
        date: dateObj,
        category: parsedData.category,
        image: imageBuffer,
        userId: userId // Now using our checked userId
      }
    });
    console.log(`✅ Product created successfully with ID: ${newProduct.id}`);

    // Return response without the binary image data
    res.status(201).json({ 
      message: "Product added successfully", 
      product: {
        ...newProduct,
        image: newProduct.image ? "Binary image data" : null // Don't send binary data in response
      }
    });
    console.log('===================== ADD PRODUCT REQUEST END =====================');
  } catch (error: any) {
    console.error('❌ ERROR adding product:', error);
    console.error('🔍 Error stack:', error.stack);
    console.log('===================== ADD PRODUCT REQUEST FAILED =====================');
    
    res.status(400).json({ error: error.message });
  }
}
