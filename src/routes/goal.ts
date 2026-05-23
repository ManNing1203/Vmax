import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
import { snakeToCamel } from "../utils/variableFormat";
import saving from "./saving";
const route = express.Router();
route.get('/',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
        await con.query('UPDATE "goals" SET achieved = $1 WHERE user_id = $2 AND total_saving >= total_target', [true, req.user?.userId]);
        let result = await con.query('SELECT * FROM "goals" WHERE user_id = $1', [req.user?.userId]);
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

function getDaysLeft(futureDateInput: string | Date): number {
  let futureDate: Date;

  if (typeof futureDateInput === "string") {
    // Parse as local time, not UTC
    const [year, month, day] = futureDateInput.split("-").map(Number);
    futureDate = new Date(year, month - 1, day);
  } else {
    futureDate = new Date(futureDateInput);
  }

  if (isNaN(futureDate.getTime())) {
    throw new Error("Invalid date");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  futureDate.setHours(0, 0, 0, 0);
  const msInADay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((futureDate.getTime() - today.getTime()) / msInADay));
}
route.post('/addGoal',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
        const { description, totalTarget , date } = req.body;
        const daysLeft = getDaysLeft(date);
        const minimumDailyIncome = totalTarget / daysLeft;
        con = await pool.connect();
        let update = await con.query('UPDATE "users" as u SET total_goal = total_goal + 1 WHERE u.user_id = $1', [req.user?.userId]);
        let result = await con.query('INSERT INTO "goals" (user_id, description, total_target,date,minimum_daily_goal_saving) VALUES ($1, $2, $3, $4,$5) RETURNING *', [req.user?.userId, description, totalTarget, date, minimumDailyIncome] );
        console.log("Goal added successfully");
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

export default route;