import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId;
    firstName:string;
    lastName:string;
    email:string;
    phone:number;
    dob:Date;
    password:string;
    preferences:string[];
}


const userSchema = new Schema<IUser>({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    preferences:{
        type:[String],
        required:true
    }
})

const User = mongoose.model<IUser>('User',userSchema)
export default User;