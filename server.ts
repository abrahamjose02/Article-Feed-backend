import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import articleRouter from './src/routes/articleRoutes'
import router from './src/routes/authRoutes'
import connectDB from './src/config/db'
import cors from 'cors';


dotenv.config()

const app = express()

connectDB()


app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

app.use('/api/auth',router);
app.use('/api/article',articleRouter);

const port = process.env.PORT || 10000;

app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
});