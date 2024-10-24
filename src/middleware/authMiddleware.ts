import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export interface AuthenticatedRequest extends Request{
    user?:{id:string}
}

export const isAuthenticated = (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const accessToken = req.cookies.accessToken

    if(!accessToken){
         res.status(401).json({ message: "Not authorized, no token" });
         return
    }
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as { id: string };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}