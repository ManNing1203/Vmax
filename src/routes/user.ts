import express, { Request, Response } from 'express';
import { PoolClient } from 'pg';
import pool from '../db';



const route = express.Router();


route.get("/",async (req:Request,res:Response)=>{
        let con:PoolClient|null =null;
    try{
        con = await pool.connect();
       let result =  await con.query('SELECT * FROM "users"');
       console.log(result.rows);
        return res.json({
            success:true,
            data: result.rows[0]
        });
    }
    catch(err){
        console.error("error",err);
        return res.json({
            success:false
        });
    }finally{
        if(con) con.release();
    }
})

route.get("/product:id",()=>{
    console.log("product");
})


export default route;