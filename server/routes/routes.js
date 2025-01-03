import express from 'express';
import { downloadImage, uploadFile } from '../controller/image.controller.js';
import upload from '../utils/upload.js';

const router = express.Router();

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/file/:fileId', downloadImage);
router.get('/',(req,res)=>{
    res.send("Hello World")
})

export default router;
