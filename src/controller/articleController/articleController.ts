import { Request,Response } from "express";
import Article,{IArticle} from "../../model/articleModel";
import User from "../../model/userModel";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import mongoose, { mongo } from "mongoose";

export const getArticles = async(req:AuthenticatedRequest,res:Response) =>{
    const userId = req.user?.id
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const articles = await Article.find({category:{$in:user.preferences}})
            .populate('author','firstName lastName')
            .exec();

            res.status(200).json({success:true,articles})
            return;
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}

export const likeArticle = async(req:AuthenticatedRequest,res:Response) =>{
    const{articleId} = req.body;
    const userId = req.user?.id

    if (!userId) {
         res.status(401).json({ message: 'User not authenticated' });
         return;
    }

    try {
        const article = await Article.findById(articleId)
        if(!article){
            res.status(404).json({ message: 'Article not found' });
            return;
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        if(article.blockedBy.includes(userObjectId)){
            res.status(400).json({message:"You cannot like a blocked article."})
            return;
        }

       if(article.likes.some(like=>like.userId.equals(userObjectId))){
        return res.status(400).json({ message: "You have already liked this article." });
       }

       article.likes.push({userId:userObjectId});

       await article.save();

        res.status(200).json({ success: true, likes: article.likes.length });
        return;
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}

export const dislikeArticle = async(req:AuthenticatedRequest,res:Response) =>{
    const{articleId} = req.body
    const userId = req.user?.id

    if(!userId){
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const article = await Article.findById(articleId)
        if(!article){
            res.status(404).json({ message: 'Article not found' });
            return;
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        if(article.blockedBy.includes(userObjectId)){
            res.status(400).json({message:"You cannot dislike a blocked article."})
            return;
        }

       if(article.dislikes.some(dislike=>dislike.userId.equals(userObjectId))){
        return res.status(400).json({ message: "You have already disliked this article." });
       }

       article.dislikes.push({userId:userObjectId});

       await article.save();

        res.status(200).json({ success: true, dislikes: article.dislikes.length });
        return;
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}

export const blockArticle = async(req:AuthenticatedRequest,res:Response)=>{
    const {articleId} = req.body
    const userId = req.user?.id
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const article = await Article.findById(articleId)
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId)

        if(article.blockedBy.includes(userObjectId)){
            return res.status(400).json({ message: "You have already blocked this article." });
        }
        article.blockedBy.push(userObjectId)
        article.blocks += 1;
        await article.save();

        res.status(200).json({success:true,blocks:article.blocks})
        return;
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}