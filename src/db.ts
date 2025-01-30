import mongoose from "mongoose";
import { ContentType } from "./interfaces/interface";





mongoose.connect("mongodb://localhost:27017/secondbrainDb");



const userSchema= new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        // minlength:3,
        // maxlength:12,
        trim:true
    }, 

    password: {
        type:String, 
        required:true , 
        // minlength:6,
        // maxlength:12
    }
});

const contentSchema= new mongoose.Schema({
    id:mongoose.Types.ObjectId,
    contentType:{
        type:String,
        enum: ["tweet", "youtube", "document", "link"],
        required:true
    },
    
    contentLink:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true,
    },

    tags:{
        type:[String],
        default:[]

    }


})

const shareSchema= new mongoose.Schema({
    shareLink:{
        type:String,
        required:true
    },
    userId:mongoose.Types.ObjectId
})


const ShareModel=mongoose.model("Share",shareSchema);
const ContentModel= mongoose.model("Content",contentSchema);
const UserModel = mongoose.model("User", userSchema);
export  { UserModel, ContentModel,ShareModel};


