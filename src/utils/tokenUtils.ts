import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface IUser {
    firstName: string;
    lastName: string;
    dob:Date;
    email: string;
    phone: string; 
    password: string;
    preferences: string[];
}


interface IActivationTokenPayload {
     token:string;
    activationCode: string;
}



export const createActivationToken = (user:IUser):IActivationTokenPayload => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        { user, activationCode },
        process.env.JWT_SECRET as string,
        {
            expiresIn: '15m',
        }
    );
    return { token, activationCode };
};

export const verifyActivationToken = (token:string) =>{
 try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
 } catch (error) {
    return null;
 }
}

export const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '5d' });
};


