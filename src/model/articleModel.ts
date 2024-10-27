import mongoose,{Document,Schema} from "mongoose";


export enum ArticleCategory {
    TECHNOLOGY = "Technology",
    HEALTH = "Health",
    EDUCATION = "Education",
    LIFESTYLE = "Lifestyle",
    FINANCE = "Finance",
    TRAVEL = "Travel",
    FOOD = "Food",
    SPORTS = "Sports",
    ENTERTAINMENT = "Entertainment",
    SCIENCE = "Science"
}


export interface IArticle extends Document{
    title:string;
    description:string;
    content: string;
    images:string[];
    tags:string[];
    category:ArticleCategory;
    author:mongoose.Types.ObjectId;
    likes:{userId:mongoose.Types.ObjectId}[];
    dislikes:{userId:mongoose.Types.ObjectId}[];
    blocks:number;
    blockedBy:mongoose.Types.ObjectId[];
}

const articleSchema = new Schema <IArticle>({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    content: { 
        type: String,
        required: true 
    },
    images:{
        type:[String],
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        enum:Object.values(ArticleCategory),
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:{
        type:[{userId:Schema.Types.ObjectId}],
        default:[]
    },
    dislikes:{
        type:[{userId:Schema.Types.ObjectId}],
        default:[]
    },
    blocks:{
        type:Number,
        default:0
    },
    blockedBy:{
        type:[Schema.Types.ObjectId],
        ref:"User",
        default:[]
    }
});

const Article = mongoose.model<IArticle>('Article',articleSchema)
export default Article