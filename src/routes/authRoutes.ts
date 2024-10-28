import express,{ Router } from "express";
import { registerUser,login,activateUser,updateUser, logout, getUserProfile, refreshToken } from "../controller/userController/userController";
import { isAuthenticated } from "../middleware/authMiddleware";


const router:Router = express.Router()

router.post('/register',registerUser)

router.post('/activate',activateUser)

router.post('/login',login);

router.post('/update',isAuthenticated,updateUser);

router.get('/profile',isAuthenticated,getUserProfile);

router.post('/refresh-token',refreshToken)

router.post('/logout',logout)

export default router   