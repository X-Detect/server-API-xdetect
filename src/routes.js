import  express from "express";
import multer from "multer";
import { signIn, signUp, uploadProfilePicture } from "./handler.js";

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
      fileSize: 1048576 * 10, // Batas ukuran file (10MB)
    },
  });

router.post('/Signup', signUp)
router.post('/Signin', signIn)
// router.post('/user/:uid/profile-picture', uploadProfilePicture);
router.post('/user/:uid/profile-picture', upload.single('file'), uploadProfilePicture);



export default router;