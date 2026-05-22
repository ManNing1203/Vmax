import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from 'jsonwebtoken';
import { PoolClient } from "pg";
import pool from "../db";

// Define your custom payload shape
interface MyJwtPayload extends JwtPayload {
  userId: number;
  email: string;
}

export default async function auth(req:any, res:any, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token",
    });
  }
    let con: PoolClient | null = null;

  try {
    const decoded = jwt.verify(
      authHeader,
      "secretkey"
    ) as MyJwtPayload;

    con = await pool.connect();
    let result = await con.query('SELECT * FROM "users" WHERE user_id = $1', [decoded.userId]);
    const user = result.rows[0];
    req.user = { userId: user.user_id, email: user.email, totalIncome: user.total_income, totalGoal: user.total_goal };
    console.log("user", req.user);
    next();

  } catch (error) {
    console.error("error", error);
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
}