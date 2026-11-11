// // scheduler.ts
// import cron from "node-cron";
// import pool from "../db";
// import { PoolClient } from "pg";

// const dailyTask = async (): Promise<void> => {
//      let con: PoolClient | null = null;
//       try {
//       con = await pool.connect();
//       let result = await con.query(
//         `
//      SELECT json_build_object(
//  'goal',
//     (
//         SELECT json_agg(g)
//         FROM goals g
//         WHERE g.user_id = 7
//     ),
//     -- Overall totals
//     'total_expenses',
//     (
//         SELECT COALESCE(SUM(total_amount), 0)
//         FROM expenses
//         WHERE user_id = 7
//     ),

//     'today_expenses',
//     (
//         SELECT COALESCE(SUM(total_amount), 0)
//         FROM expenses
//         WHERE user_id = 7
//         AND DATE(created_at) = CURRENT_DATE
//     ),

//     'this_week_expenses',
//     (
//         SELECT COALESCE(SUM(total_amount), 0)
//         FROM expenses
//         WHERE user_id = 7
//         AND DATE_TRUNC('week', created_at) = DATE_TRUNC('week', CURRENT_DATE)
//     ),

//     'this_month_expenses',
//     (
//         SELECT COALESCE(SUM(total_amount), 0)
//         FROM expenses
//         WHERE user_id = 7
//         AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
//     ),

//     -- Monthly summary
//     'by_month',
//     (
//         SELECT json_agg(month_data)
//         FROM (
//             SELECT 
//                 TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
//                 SUM(total_amount) AS total_expenses
//             FROM expenses
//             WHERE user_id = 7
//             GROUP BY month
//             ORDER BY month DESC
//         ) month_data
//     ),

//     -- Weekly summary
//     'by_week',
//     (
//         SELECT json_agg(week_data)
//         FROM (
//             SELECT 
//                 TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') AS week_start,
//                 SUM(total_amount) AS total_expenses
//             FROM expenses
//             WHERE user_id = 7
//             GROUP BY week_start
//             ORDER BY week_start DESC
//         ) week_data
//     ),

//     -- Daily summary
//     'by_day',
//     (
//         SELECT json_agg(day_data)
//         FROM (
//             SELECT 
//                 DATE(created_at) AS day,
//                 SUM(total_amount) AS total_expenses
//             FROM expenses
//             WHERE user_id = 7
//             GROUP BY day
//             ORDER BY day DESC
//         ) day_data
//     ),

//     -- Category summary
//     'by_category',
//     (
//         SELECT json_agg(category_data)
//         FROM (
//             SELECT 
//                 category,
//                 SUM(total_amount) AS total_expenses
//             FROM expenses
//             WHERE user_id = 7
//             GROUP BY category
//             ORDER BY total_expenses DESC
//         ) category_data
//     ),

//     -- Highest spending category
//     'top_category',
//     (
//         SELECT json_build_object(
//             'category', category,
//             'total_expenses', SUM(total_amount)
//         )
//         FROM expenses
//         WHERE user_id = 7
//         GROUP BY category
//         ORDER BY SUM(total_amount) DESC
//         LIMIT 1
//     ),

//     -- Latest expenses
//     'recent_expenses',
//     (
//         SELECT json_agg(recent_data)
//         FROM (
//             SELECT
//                 expense_id,
//                 category,
//                 description,
//                 total_amount,
//                 created_at
//             FROM expenses
//             WHERE user_id = 7
//             ORDER BY created_at DESC
//             LIMIT 5
//         ) recent_data
//     )

// ) AS expense_summary;
//      ` , [context.userId]);

//       const expenseSummary = result.rows[0].expense_summary;


//     } catch (err) {
//       console.error("error", err);
//       return {
//         success: false
//       };
//     } finally {
//       if (con) con.release();
//     }
// };



// cron.schedule(
//   "0 0 * * *",
//   async () => {
//     await dailyTask();
//   },
//   {
//     timezone: "Asia/Kuala_Lumpur",
//   }
// );


// console.log("Scheduler started");