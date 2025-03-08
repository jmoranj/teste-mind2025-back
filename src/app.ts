import cors from 'cors';
import express from "express";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";

const app = express()
app.use(express.json())
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use(cors())

export default app
