import { Router } from "express";
import login from "../controllers/userController/login";
import logout from "../controllers/userController/logout";
import refreshToken from "../controllers/userController/refreshToken";
import registerUser from "../controllers/userController/register";
import userById from "../controllers/userController/userById";
import validateJwt from "../controllers/userController/validateJwt";


const userRouter = Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', login);
userRouter.get('/validate-jwt', validateJwt);
userRouter.get('/logout', logout);
userRouter.get('/refresh-token', refreshToken); 
userRouter.get('/:id', userById);

export default userRouter