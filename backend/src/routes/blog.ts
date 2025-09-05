import { Hono } from "hono";
import auth from "../middlewares/jwtAuth";
import { PrismaClient } from "@prisma/client/edge"; 
import { blogPost , blogPostUpdate } from "@akash.09/mediumprocommon"; 

const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL :string,
        JWT_SECRET :string
    },
    Variables: {
        userId : string
    }
}>
blogRouter.use(auth)

blogRouter.post("/" , async (c)=>{
    try {
        const body = await c.req.json();
        const zodH = blogPost.safeParse(body);
        // authorId isnt required 
        // if(!zodH.success){ return c.json({ message: zodH.error }) }
        const akash = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        })
        await akash.posts.create({
            data: {
                title :body.title, 
                content : body.content,
                authorId : c.get("userId")
            }
        })
        return c.text('Created Blog!');
    } catch(e){
        c.status(411)
      return c.json("error")  
    }
  })
  
blogRouter.put("/" , async (c)=>{
    try {
        const body = await c.req.json();
        const zodH = blogPostUpdate.safeParse(body);
        if(!zodH.success){ return c.json({ message: zodH.error }) }
        const akash = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        })
        await akash.posts.update({
            where:{
                id: c.get("userId")
            },
            data: {
                title :body.title, 
                content : body.content
            }
        })
        return c.text('Updated Blog!');  
    } catch(e){
        c.status(411)
        return c.json("error")  
    }
  })


blogRouter.get("/bulk" , async (c)=>{
 try {
        const akash = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        })
        const blog = await akash.posts.findMany({
            select : {
                id : true,
                title:true,
                content : true,
                author :{
                    select: {
                        name : true,
                    }
                }
            }
        })
        return c.json({
            blog : blog
        }); 
    } catch(e){
        c.status(411)
        return c.json("error")  
    }
})

blogRouter.get( "/:id", async (c)=>{
    try {
        const id = c.req.param("id")
        const akash = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        })
        const blog = await akash.posts.findUnique({
            where:{
                id: id
            },
            select: {
                id : true, 
                title :  true,  
                content : true ,
               author  : { 
                select : {
                    name : true 
                }
               }    
            }
        })
        return c.json({
            blog : blog
        }); 
    } catch(e){
        c.status(411)
        return c.json("error")         
    }
})


export { blogRouter }
