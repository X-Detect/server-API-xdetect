import  express from "express";
import { signUp } from "./handler.js";

const router = express.Router();

router.post('/Signup', signUp)


export default router;