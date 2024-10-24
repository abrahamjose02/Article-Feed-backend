import { Request,Response } from "express";
import Article,{IArticle} from "../../model/articleModel";
import User from "../../model/userModel";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import mongoose from "mongoose";
import { uploadImageToS3 } from "../../utils/s3Uploader";

export const getArticles = async(req:AuthenticatedRequest,res:Response) =>{
    const userId = req.user?.id
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
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
         res.status(400).json({ message: "You have already liked this article." });
         return;
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
            res.status(400).json({message:"You cannot dislike a blocked article."})
            return;
        }

       if(article.dislikes.some(dislike=>dislike.userId.equals(userObjectId))){
         res.status(400).json({ message: "You have already disliked this article." });
         return;
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
         res.status(401).json({ message: 'User not authenticated' });
         return;
    }
    try {
        const article = await Article.findById(articleId)
        if (!article) {
             res.status(404).json({ message: 'Article not found' });
             return;
        }

        const userObjectId = new mongoose.Types.ObjectId(userId)

        if(article.blockedBy.includes(userObjectId)){
             res.status(400).json({ message: "You have already blocked this article." });
             return;
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

export const createArticle = async(req:AuthenticatedRequest,res:Response) =>{
    const{title,description,tags,category} = req.body
    const userId = req.user?.id

    if(!userId){
        res.status(401).json({message:"User not authenticated"})
        return;
    }

    try {
        if (!req.file) {
             res.status(400).json({ message: "Image is required" });
             return;
        }

        const imageUrl = await uploadImageToS3(req as any);

        if (!imageUrl) {
             res.status(500).json({ message: "Image upload failed" });
             return;
        }

         const newArticle = new Article({
            title,
            description,
            images: [imageUrl],
            tags,
            category,
            author: req.user!.id
        });

        await newArticle.save();
        res.status(201).json({ success: true, article: newArticle });
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}

export const getUserArticles = async(req:AuthenticatedRequest,res:Response) =>{
    const userId = req.user?.id

    if(!userId){
        res.status(401).json({ message: "User not authenticated" });
        return;
    }
    try {
        const articles = await Article.find({author:userId}).exec()
        res.status(200).json({ success: true, articles });
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}


export const updateArticle = async(req:AuthenticatedRequest,res:Response) =>{
    const{articleId} = req.params
    const{title,description,tags,category} = req.body;
    const userId = req.user?.id

    if (!userId) {
         res.status(401).json({ message: "User not authenticated" });
         return;
    }

    try {
        const article = await Article.findOne({_id:articleId,author:userId})
        if(!article){
            res.status(404).json({ message: "Article not found or unauthorized" });
            return;
        }

        if (req.file) {
            const imageUrl = await uploadImageToS3(req as any);  
            if (imageUrl) {
                article.images = [imageUrl];
            } else {
                 res.status(500).json({ message: "Image upload failed" });
                 return;
            }
        }

        article.title = title || article.title;
        article.description = description || article.description;
        article.tags = tags || article.tags;
        article.category = category || article.category;


        await article.save();
        res.status(200).json({ success: true, article });

    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}

export const deleteArticle = async(req:AuthenticatedRequest,res:Response) =>{
    const{articleId} = req.params
    const userId = req.user?.id

    if (!userId) {
         res.status(401).json({ message: "User not authenticated" });
         return
    }

    try {
        const article = await Article.findOneAndDelete({ _id: articleId, author: userId });
        if (!article) {
             res.status(404).json({ message: "Article not found or unauthorized to delete" });
             return;
        }

        res.status(200).json({ success: true, message: "Article deleted successfully" });
        return;
    } catch (e:any) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }
}