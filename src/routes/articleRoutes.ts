import express,{Router} from 'express'
import { getArticles,createArticle,getUserArticles,updateArticle,deleteArticle,likeArticle,dislikeArticle,blockArticle } from '../controller/articleController/articleController';
import { isAuthenticated } from '../middleware/authMiddleware';
import upload from '../utils/multer';

const articleRouter:Router = express.Router()

articleRouter.get('/',isAuthenticated,getArticles)

articleRouter.post('/create', isAuthenticated, upload.single('file'), createArticle);

articleRouter.get('/user', isAuthenticated, getUserArticles);

articleRouter.put('/:articleId', isAuthenticated, updateArticle);

articleRouter.delete('/:articleId', isAuthenticated, deleteArticle);

articleRouter.post('/like', isAuthenticated, likeArticle);

articleRouter.post('/dislike', isAuthenticated, dislikeArticle);

articleRouter.post('/block', isAuthenticated, blockArticle);

export default articleRouter;