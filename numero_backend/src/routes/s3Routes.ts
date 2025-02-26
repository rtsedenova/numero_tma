import express from 'express';
import multer from 'multer';
import { uploadFile, getFile } from '../controllers/s3Controller';

const router = express.Router();
const upload = multer(); 

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
      await uploadFile(req, res);
    } catch (error) {
      next(error); 
    }
  });

router.get('/file/:fileName', getFile);

export default router;
