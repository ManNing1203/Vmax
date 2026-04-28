import express, { Request, Response } from 'express';
import productRoute from './routes/product';
import pool from './db';
import { Pool, PoolClient } from 'pg';
// const apiRoute = express.Router();

const app = express();

const Port = 3000;
app.use(express.json());
app.use("/product",productRoute);

// app.use("/",async (req,res)=>{
//     let con:PoolClient|null =null;
//     try{
//         con = await pool.connect();
//        let result =  await con.query('SELECT * FROM "users"');
//        console.log(result.rows);
//         return res.json({
//             success:false,
//             data: result.rows[0]
//         });
//     }
//     catch(err){
//         console.error("error",err);
//         return res.json({
//             success:false
//         });
//     }finally{
//         if(con) con.release();
//     }

// })



app.listen(Port,()=>{
      console.log(`Server running on http://localhost:${Port}`);
}) 








