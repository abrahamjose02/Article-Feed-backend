import { Router } from "express";
import { registerUser,login,activateUser,updateUser, logout, getUserProfile } from "../controller/userController/userController";
import { isAuthenticated } from "../middleware/authMiddleware";


const router = Router()

router.post('/register',registerUser)

router.post('/activate',activateUser)

router.post('/login',login);

router.post('/profile',isAuthenticated,updateUser);

router.get('/profile',isAuthenticated,getUserProfile);

router.post('/logout',logout)