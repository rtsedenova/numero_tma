import express from 'express';
import multer from 'multer';
import { getFileController } from '../controllers/s3/getFile.controller';
import { uploadFileController } from '../controllers/s3/uploadFile.controller';

const router = express.Router();
const upload = multer(); 

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
      await uploadFileController(req, res);
    } catch (error) {
      next(error); 
    }
  });

  router.get('/file/:fileName', getFileController);


export default router;
