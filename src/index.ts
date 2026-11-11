import express, { Request, Response } from 'express';
import userRoute from './routes/user';
import ragRoute from './routes/rag';
import savingRoute from './routes/saving';
import expenseRoute from './routes/expence';
import goalRoute from './routes/goal';
import pool from './db';
import session from "express-session";
import path from "path";
import './schedule/dailyTask';
import './schedule/monthlyTask';
import { Pool, PoolClient } from 'pg';
import { PORT, SESSION_SECRET } from './config';
// const apiRoute = express.Router();

const app = express();

const Port = PORT;
app.use(express.json());
app.use("/user",userRoute);
app.use("/rag",ragRoute);
app.use("/saving",savingRoute);
app.use("/expense",expenseRoute);
app.use("/goal",goalRoute);
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


// app.use("/",async (req,res)=>{
//     let con:PoolClient|null =null;
//     try{
//         con = await pool.connect();
//        let result =  await con.query('SELECT * FROM "users"');
//        console.log(result.rows);
//         return res.json({
//             success:false,
//             data: result.rows[0]
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



app.listen(Port,()=>{
      console.log(`Server running on http://localhost:${Port}`);
}) 








