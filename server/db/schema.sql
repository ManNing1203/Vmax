-- Vmax database schema (PostgreSQL). Safe to re-run.
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  total_goal INT DEFAULT 0, total_income DOUBLE PRECISION DEFAULT 0, monthly_income DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS goals (
  goal_id SERIAL PRIMARY KEY, user_id INT REFERENCES users(user_id), description TEXT,
  total_target DOUBLE PRECISION, total_saving DOUBLE PRECISION DEFAULT 0, date DATE,
  minimum_daily_goal_saving DOUBLE PRECISION DEFAULT 0, achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE IF NOT EXISTS expenses (
  expense_id SERIAL PRIMARY KEY, user_id INT REFERENCES users(user_id), total_amount DOUBLE PRECISION,
  description TEXT, category TEXT DEFAULT 'Others', created_at TIMESTAMPTZ DEFAULT now());
