import express from "express";
import {router as postRouter} from "./routes/post.js";
const app = express();

app.use(express.static('public'));
app.use(express.json());   // 一定要放在路由之前才能解析req.body
app.use('/api', postRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000 ')
})

