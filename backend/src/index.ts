import { Hono } from 'hono'
import  { userRouter } from './routes/user'
import {blogRouter} from './routes/blog'
import { cors } from 'hono/cors'
import { findUser } from './routes/findUser'

const app = new Hono()

app.use(cors())
app.route("/" , (c)=>{
  return c.json({
  message : "Backend is up!"
  })
})
app.route("/api/v1/user" , userRouter)
app.route("/api/v1/blog" , blogRouter)
app.route("/api/v1/userfind" , findUser)


export default app
