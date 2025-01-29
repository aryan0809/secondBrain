import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secret } from "..";  // Make sure the secret is being imported correctly
import { UserInterface } from "../interfaces/interface";  // Make sure UserInterface is being used correctly
import { UserModel} from "../db";



declare global{
    namespace Express {
        interface Request {
            user?:UserInterface
        }
    }
}

export const authMiddleware= async(req:Request , res:Response, next:NextFunction):Promise<any>=>{

    const token = req.headers.authorization;

      if (!token)return res.status(401).json({
        message:"Token not provided"
    })

    try{

        const decoded= jwt.verify(token,secret) as{ userId:string} ;

        console.log(decoded);

        const decodedUser = await UserModel.findOne({ _id: decoded.userId });

        if(!decodedUser) return res.status(404).json({
            message:"token invalid ",
        })

        req.user= decodedUser;
        next();

    }catch(error){
        res.status(500).json({
            message:"internval server error",
            error
        })
    }

}


