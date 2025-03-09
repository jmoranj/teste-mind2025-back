import { Router } from "express";
import addProduct from "../controllers/productController/addProduct";
import deleteProduct from "../controllers/productController/deleteProdut";
import getProducts from "../controllers/productController/getProducts";
import updateProduct from "../controllers/productController/updateProduct";
import upload from "../middleware/storageFile";

const productRouter = Router()

productRouter.post('/', upload.single('image'), addProduct)
productRouter.get('/:id', getProducts)
productRouter.put('/:id',upload.single('image'), updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter