import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
const route = express.Router();

//  { email: user.email, userId: user.id},

route.post('/setTotalIncome',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        const { totalIncome } = req.body;
   // Assuming 30 days in a month
        con = await pool.connect();
        let result = await con.query('UPDATE "users" as u SET total_income = $1 WHERE u.user_id = $3', [totalIncome, req.user?.userId]);
        
        return res.json({
            success: true
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
route.post('/setMonthlyIncome',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        const { monthlyIncome } = req.body;

        con = await pool.connect();
        let result = await con.query('UPDATE "users" as u SET monthly_income = $1 WHERE u.user_id = $2', [monthlyIncome, req.user?.userId]);
        
        return res.json({
            success: true
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

// route.get('/setGoal',auth,async (req: express.Request, res: express.Response)=>{
//       let con: PoolClient | null = null;
//     try {

//         const { totalIncome } = req.body;
//         con = await pool.connect();
//         let result = await con.query('UPDATE "users" SET totalIncome = $1 WHERE userId = $2', [totalIncome, req.user?.userId]);
        
//         return res.json({
//             success: true
//         });
//     }
//     catch (err) {
//         console.error("error", err);
//         return res.json({
//             success: false
//         });
//     } finally {
//         if (con) con.release();
//     }

// })
export default route;
