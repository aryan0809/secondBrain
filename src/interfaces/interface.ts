import mongoose,{ ObjectId } from "mongoose"
import { Type } from "react-toastify/dist/utils"

export interface UserInterface{
    _id: mongoose.Types.ObjectId;
    username:string,
    password:string,
    // __v?:number
}

export interface SignInResponse{
    
    message:string,
    token?:string
}
export interface ContentType{
    type:"tweet" | "youtube" | "link" | "document",
    link:string,
    title:string,
    tags?:string[]

    }
