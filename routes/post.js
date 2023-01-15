import express from 'express';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import crypto from 'crypto';
import multer from 'multer';
import {pool} from '../model/db_conn.js';

dotenv.config();

const router = express.Router();
const cloudfrontUrl = 'https://d1kd77tnohewk3.cloudfront.net'
const storage = multer.memoryStorage();
const upload = multer({storage: storage})
const bucketName=process.env.BUCKET_NAME
const bucketRegion=process.env.BUCKET_REGION
const accessKey=process.env.ACCESS_KEY
const secretAccessKey=process.env.SECRET_ACCESS_KEY
const s3 = new S3Client({ 
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion 
});



router.get('/posts', async(req, res) => {
  const allPostsSql = 'SELECT * FROM ??';
  pool.query(allPostsSql, ['posts'], (err, results)=>{
    if (err) {
      return res.json({error: err});
    };
    let posts = []
    for (const result of results ) {
      let post = {
        'message': result.message,
        'url': `${cloudfrontUrl}/${result.image_name}`
      };
      posts.push(post);
    };
    res.json({data: posts})
  });
});


router.post('/posts', upload.single('file'),async (req, res) => {
  // save image in S3
  const imageName = crypto.randomBytes(16).toString('hex');
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };
  const putCommand = new PutObjectCommand(params);
  await s3.send(putCommand);

   // save image & message in RDS
   const sql = 'INSERT INTO posts (message, image_name) VALUES (?, ?)'
   const msg = req.body.message;
   pool.query(sql, [msg, imageName], (err, results) => {
    if (err) {
      console.error('Database connection failed: ', err);
      return;
    };
  });
  const imageUrl = `${cloudfrontUrl}/${imageName}`;
  res.json({data:{url: imageUrl, message: msg}})
});

router.all('*', (req, res) => {
  res.status(404).send('<h1> 404 Page Not Found </h1>')
});

export {router}