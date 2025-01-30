
import express , {NextFunction, Request, Response} from "express";
import jwt, { Jwt } from "jsonwebtoken";
import { authMiddleware } from "./middlewares/middleware";
import {ContentModel, ShareModel, UserModel} from "./db";
import { Share } from "./interfaces/interface";

export const secret = "your-secret-key";



const app= express();
app.use(express.json());

const alphanumeric: string[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9"
];


function getRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    return result;
}

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

    const id= req.user?._id;

    try{
        const newContent= new ContentModel({
            id,
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

        const userContent= await ContentModel.find({
            id:userId
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


app.delete('/api/v1/:id', authMiddleware, async(req:Request, res:Response):Promise<any>=>{

    const userId= req.user?._id;
    const contentId=req.params.id;

    try{

        if(!contentId)return res.status(411).json({
            messsage:"content Id not provided"
        }
        )
    
        const content= await ContentModel.findOneAndDelete({
            id:userId,
            _id:contentId
        })


        res.status(201).json({
            message:"content deleted successfully",
            content
        })

        
    
        if(!content)return res.status(404).json(
            {
                message:"contentId does not exist "
            }
        )
    }catch(error:any){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }

   


})


app.get("api/v1/shareBrain",authMiddleware,async(req:Request, res:Response)=>{

    const str= getRandomString(15);
    const userId=req.user?._id;

    try{

        const shareLink=  new ShareModel({
            str,
            userId
    
        })

        await shareLink.save();

        res.status(200).json({
            str
        })
    }catch(error:any){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
    
   
})

app.get("/api/v1/:shareLink", async(req:Request, res:Response):Promise<any>=>{
    const shareLink= req.params.shareLink;
    

    try{

        const share= await ShareModel.find({
            str:shareLink,
            
        })
        if(!share)return res.status(404).json({
            message:"Link Invalid or expired"
        })
    
        const content= ContentModel.find({
            // @ts-ignore
            userId:share.userId
        })
    
        if(!content)res.status(404).json({
            message:"content does not exist "
        })
    
        res.status(200).json({
            content
        })
    }catch(error:any){
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
    
})

app.post('/api/v1/authCheck', authMiddleware, async (req: Request, res: Response)=> {
    res.send("User authenticated successfully"); 
});


app.listen(3000);