
import express , {NextFunction, Request, Response} from "express";
import jwt, { Jwt } from "jsonwebtoken";
import { SignInResponse } from "./interfaces/interface";
import { authMiddleware } from "./middlewares/middleware";
import {ContentModel, UserModel} from "./db";

export const secret = "your-secret-key";



const app= express();
app.use(express.json());

app.post('/api/v1/signup' , async(req:Request, res:Response)=>{

    try{
        
        
        const {username , password} = req.body;
        // console.log("control reached here "+ username + password );


                

        if(!username || !password)
             res.status(411).json({
            message:"username or password not provided"
        })

        

        const newUser=  new UserModel({
            username,
            password
        })
    
        await newUser.save();
    
        res.status(200).json({
            message:"new user created",
            newUser
        });
    }catch(error:any){
        res.status(500).json({
            message:"Internal server error", 
            error :error.message
        })
    }
    
   
    
})


app.post('/api/v1/signin', async (req: Request, res: Response):Promise<any> =>{
    try {
        const { username, password } = req.body;

        if (!username || !password) return  res.status(411).json({
            message: "Username or password not provided",
        });

        // Use findOne instead of find
        const user = await UserModel.findOne({ username, password });

        if (!user) return res.status(404).json({
            message: "Username or password incorrect"
        });

        // Define a secret or retrieve from env
         

        // Correct access to properties of user
        const token = jwt.sign({ userId: user._id, username: user.username }, secret);

        res.status(200).json({
            token,
            message: "User signed in",
            
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});


app.post('/api/v1/content', authMiddleware, async(req:Request, res:Response)=>{

    const{contentType, contentLink, title, tags}= req.body;

    const userId= req.user?._id;

    try{
        const newContent= new ContentModel({
            userId,
            contentType,
            contentLink,
            title,
            tags
        })
    
        await newContent.save();
    
        res.status(200).json({
            message:"content saved successfully",
            newContent
        })
    }catch(error:any){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

   
   

})


app.get('/api/v1/content', authMiddleware, async(req:Request, res:Response):Promise<any>=>{

    const userId= req.user?._id;
    try{

        const userContent= await ContentModel.findById({
            _id:userId
        })

        if(!userContent)return res.status(411).json({
            message:"user has no content "
        })

        res.status(201).json({
            userContent
        })

    }catch(error:any){
        res.status(500).json({
            messsage:"Internal server error",
            error:error.message
        })
    }
})

app.post('/api/v1/authCheck', authMiddleware, async (req: Request, res: Response)=> {
    res.send("User authenticated successfully"); 
});


app.listen(3000);