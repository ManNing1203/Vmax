import express ,{Request,Response}from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import auth from "../middleware/auth";
import { snakeToCamel } from "../utils/variableFormat";
const route = express.Router();
route.get('/',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
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
route.post('/addGoal',auth,async (req:any, res:any)=>{
    let con: PoolClient | null = null;
    try {
         con = await pool.connect();
        const { description, totalTarget } = req.body;
        con = await pool.connect();
        let result = await con.query('INSERT INTO "goals" (user_id, description, total_target) VALUES ($1, $2, $3) RETURNING *', [req.user?.userId, description, totalTarget] );
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