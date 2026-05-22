import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
import { snakeToCamel } from "../utils/variableFormat";
const route = express.Router();

//  { email: user.email, userId: user.id},

route.post('/addExpense',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
        await con.query('BEGIN');
        const { totalAmount, description } = req.body;
        let result = await con.query('INSERT INTO "expenses" (user_id, total_amount, description) VALUES ($1, $2, $3)', [req.user?.userId, totalAmount, description]);
        const userTotalIncome = req.user?.totalIncome - totalAmount;
        await con.query(`UPDATE "users" SET total_income = $1 WHERE user_id = $2`, [userTotalIncome, req.user?.userId]);
        if(req.user?.totalGoal > 0){
            const saving = (req.user.totalIncome / 30) / req.user.totalGoal;
            await con.query(`UPDATE "goals" SET total_saving = $1 WHERE user_id = $2`, [saving, req.user?.userId]);
        }
        console.log("Expense added successfully");
        await con.query('COMMIT');
        return res.json({
            success: true
        });
    }
    catch (err) {
        console.error("error", err);
        if(con) {
            await con.query('ROLLBACK');
        }
        return res.json({
            success: false
        });
    } finally {
        if (con) con.release();
    }

})

route.get('/',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
        let result = await con.query('SELECT * FROM "expenses" WHERE user_id = $1', [req.user?.userId]);
        console.log(result.rows);
        return res.json({
            success: true,
            data: snakeToCamel(result.rows)
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
