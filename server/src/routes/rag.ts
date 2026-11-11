import express, { Request, Response } from 'express';
import { RagTesting2 } from '../utils/RagTesting';
import auth from '../middleware/auth';
const route = express.Router();


route.get('/',auth,async (req,res)=>{
const result= await RagTesting2()
 res.json(result);
})

export default route;

