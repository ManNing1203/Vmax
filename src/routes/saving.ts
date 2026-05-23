import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
const route = express.Router();

//  { email: user.email, userId: user.id},

route.post('/addTotalIncome',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        const { totalIncome } = req.body;
   // Assuming 30 days in a month
        con = await pool.connect();
        let result = await con.query('UPDATE "users" as u SET total_income = total_income + $1 WHERE u.user_id = $2', [totalIncome, req.user?.userId]);
        
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

// route.post('/addSavings',auth,async (req:any, res:any)=>{
//     let con: PoolClient | null = null;
//     try {
//         const { saving } = req.body;

//         con = await pool.connect();
//         let result = await con.query('UPDATE "users" as u SET total_income = total_income - $1 WHERE u.user_id = $2', [saving, req.user?.userId]);
//         // let result = await con.query('UPDATE "goals" as u SET monthly_income = $1 WHERE u.user_id = $2', [monthlyIncome, req.user?.userId]);
//         const savingEachGoal = saving / req.user?.totalGoal; 
//         const totalDailyGoalSaving = await con.query(`UPDATE "goals" SET total_saving = total_saving + $1 WHERE user_id = $2 AND achieved = false RETURNING *`, [savingEachGoal, req.user?.userId]);
//         console.log("Total daily goal saving updated successfully");
//         console.log(totalDailyGoalSaving.rows);

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

// route.post('/getUnallocatedFund',auth,async (req:any, res:any)=>{
//     let con: PoolClient | null = null;
//     try {
//         const { monthlyIncome } = req.body;

//         con = await pool.connect();
//         let result = await con.query(`SELECT * FROM "users" WHERE user_id = $1`, [req.user?.userId]);
        
//         return res.json({
//             success: true,
//             unallocatedFund: result.rows[0].unallocated_fund
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
