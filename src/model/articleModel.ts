import mongoose,{Document,Schema} from "mongoose";


export interface IArticle extends Document{
    title:string;
    description:string;
    images:string[];
    tags:string[];
    category:string;
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