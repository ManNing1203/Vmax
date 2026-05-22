import express, { Request, Response } from 'express';
import { PoolClient } from 'pg';
import pool from '../db';



const route = express.Router();


route.post("/erpGetPayment", async (req: Request, res: Response) => {
    let con: PoolClient | null = null;
    try {
        const { payment_id } = req.body;
        const abortController = new AbortController(); //avoid hang
        const timeOut = setTimeout(() => abortController.abort(), 6000); //6 second
        let response;
        try {
            response = await fetch(
                `https://dev.innoxpay.com.sg/api/payment/external/buyerPayment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "payment_id": "TXN26-197",
                    "event_type": "payment"
                }),
                signal: abortController.signal
            }
            );
        } finally {
            clearTimeout(timeOut);
        }

        if (!response || !response.ok) {
            console.error(`webhook failed : Error:${response?.status || `No Response`}`);
            return false;
        }
        let result = await response.json();
        console.log(`webhook response : ${JSON.stringify(result)}`);

        con = await pool.connect();
        result = await con.query('SELECT * FROM "users"');
        console.log(result.rows);
        return res.json({
            success: true,
            data: result.rows
        });
    }
    catch (err) {
        console.error("error", err);
        return res.json({
            success: false
        });
    } finally {
        if (con) con.release();
    }
})

// route.get("/user:id",()=>{
//     console.log("user");
// })
// route.get("/",async (req:Request,res:Response)=>{
//         let con:PoolClient|null =null;
//     try{
//         con = await pool.connect();
//        let result =  await con.query('SELECT * FROM "users"');
//        console.log(result.rows);
//         return res.json({
//             success:true,
//             data: result.rows
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

// route.get("/user:id",()=>{
//     console.log("user");
// })


export default route;