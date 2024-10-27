import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import articleRouter from './src/routes/articleRoutes'
import router from './src/routes/authRoutes'
import connectDB from './src/config/db'
import cors from 'cors';


dotenv.config()

const app = express()


console.log('Environment Variables:', {
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
});

connectDB()


app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

app.use('/api/auth',router);
app.use('/api/articles',articleRouter);

const port = process.env.PORT || 10000;

app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
});