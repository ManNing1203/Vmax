import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
import { snakeToCamel } from "../utils/variableFormat";
import multer from "multer";
import Tesseract, { createWorker } from "tesseract.js";
import { createAgent } from "langchain";
import model from "../model";
import { invoiceTool } from "../tools/invoiceTool";
const route = express.Router();

//  { email: user.email, userId: user.id},

route.post('/addExpense',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {    
        con = await pool.connect();

        const { totalAmount, description } = req.body; 
        const totalDailyExpenses = await con.query(`SELECT SUM(total_amount) as total_expenses FROM "expenses" WHERE user_id = $1 AND created_at >= DATE_TRUNC('day', CURRENT_DATE)`, [req.user?.userId]);
        const totalDailyGoalSaving = await con.query(`SELECT SUM(minimum_daily_goal_saving) as total_goal_saving FROM "goals" WHERE user_id = $1 AND achieved = false`, [req.user?.userId]);
        const userTotalDailyRemaining = (req.user?.totalIncome / 30) - totalDailyExpenses.rows[0].total_expenses;
        if(userTotalDailyRemaining >= totalDailyGoalSaving.rows[0].total_goal_saving) {
        return res.json({
            success: false,
            overLimit: true,
            message: "You have reached your daily income limit. Please adjust your expenses or increase your total income."
        });
        }
        let result = await con.query('INSERT INTO "expenses" (user_id, total_amount, description) VALUES ($1, $2, $3) RETURNING *', [req.user?.userId, totalAmount, description]);
        console.log("Expense added successfully", result.rows[0]);
  
        return res.json({
            success: true
        });
        // const userTotalIncome = req.user?.minimumDailyIncome - totalAmount;
        // if(req.user?.totalGoal > 0 && userTotalIncome > 0) {
        //     const saving = (req.user.totalIncome / 30) / req.user.totalGoal;
        //     await con.query(`UPDATE "goals" SET total_saving = $1 WHERE user_id = $2`, [saving, req.user?.userId]);
        
        // }
        //  if(req.user?.totalGoal > 0 && req.user?.minimumDailyIncome <= 0) {
        // return res.json({
        //     success: false,
        //     overLimit: true,
        //     message: "You have reached your total income limit. Please adjust your expenses or increase your total income."
        // });
        // }
     
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
const upload = multer({ dest: "uploads/" });
function getUniqName(fileName: string) {
  const fileExtension = fileName.split('.').pop();
  const uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return `${uniqueId}-${Date.now()}.${fileExtension}`;
}
route.post('/scanExpensePic', upload.single('pic'),async (req:any, res:any)=>{
    
    try {    
    console.log("File received:", req.file?.originalname); // Debug log to check the received file
        
        if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
        const worker = await createWorker(['eng','chi_sim','msa']);
        const ret = await worker.recognize(req.file.path);
        console.log(ret.data.text);
        await worker.terminate();

        const agent = createAgent(
            {
                model,
                tools:[invoiceTool]
            }
        )
        const result = await agent.invoke(
            {
                messages: [{ role: "user", content: `Extract the expense information from the following text and return in JSON format with keys: category, description, totalAmount, date. Text: ${ret.data.text}` }],
            },
        );
        const messages = result.messages;

        // find tool message
        const toolMessage = messages.find(
        (m: any) => m._getType?.() === "tool"
        );
        if(toolMessage) {
            const expenseData = JSON.parse(toolMessage?.content as string);
        
        console.log(expenseData);
       if(!expenseData.check || expenseData.totalAmount === null|| expenseData.totalAmount === null) {
        throw new Error("The text contains invoice or expense relevant information but failed to extract. Please make sure the text contains clear information like totalAmount and try again.");
       }
        return res.json({
            success: true
        });
        // const userTotalIncome = req.user?.minimumDailyIncome - totalAmount;
        // if(req.user?.totalGoal > 0 && userTotalIncome > 0) {
        //     const saving = (req.user.totalIncome / 30) / req.user.totalGoal;
        //     await con.query(`UPDATE "goals" SET total_saving = $1 WHERE user_id = $2`, [saving, req.user?.userId]);
        
        // }
        //  if(req.user?.totalGoal > 0 && req.user?.minimumDailyIncome <= 0) {
        // return res.json({
        //     success: false,
        //     overLimit: true,
        //     message: "You have reached your total income limit. Please adjust your expenses or increase your total income."
        // });
        // }
     
    }
    }
    catch (err) {
        console.error("error", err);
        return res.json({
            success: false
        });
    } finally {
           
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
