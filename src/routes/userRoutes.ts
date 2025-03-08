import { Router } from "express";
import loginUser from "../controllers/userController/login";
import logoutUser from "../controllers/userController/logout";
import registerUser from "../controllers/userController/register";

const userRouter = Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logoutUser)

export default userRouter