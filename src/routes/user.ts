import express, { Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PoolClient } from "pg";
import pool from "../db";
import { snakeToCamel } from '../utils/variableFormat';

const route = express.Router();
// {
//     "email":"jojo@gmail.com",
// "password":"123"
// }
// REGISTER
route.post("/register", async (req, res) => {
    // hash password
    let con: PoolClient | null = null;
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        con = await pool.connect();
        let result = await con.query('INSERT INTO "users" (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        
        return res.json({
            success: true,
            data: snakeToCamel(result.rows[0])
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


});

// LOGIN
route.post("/login", async (req, res) => {
    let con: PoolClient | null = null;
    try {
        con = await pool.connect();
        const { email, password } = req.body;

        let result = await con.query('SELECT * FROM "users" WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Wrong password",
            });
        }
        // create token
        const token = jwt.sign(
            { email: user.email, userId: user.user_id, totalIncome: user.total_income,totalGoal: user.total_goal },
            "secretkey");
            
        res.json({
            success: true,
            token,
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

});

 export default route;