-- Demo data for local development and demos. All of it is fictional.
-- Login: demo@vmax.app / VmaxDemo2026
INSERT INTO users (email, password, total_goal, monthly_income)
VALUES ('demo@vmax.app', '$2b$10$W7rU9Pvs9DqWKwutQX/hGu3wUy3OeOBhwsa9NTC1x7VZn6EvFf.fK', 3, 4500)
ON CONFLICT (email) DO NOTHING;

INSERT INTO goals (user_id, description, total_target, total_saving, date, minimum_daily_goal_saving)
SELECT u.user_id, g.description, g.total_target, g.total_saving, g.date::date,
       g.total_target / GREATEST(1, g.date::date - CURRENT_DATE)
FROM users u,
     (VALUES ('New Laptop', 4200, 2730, '2027-06-30'),
             ('Emergency Fund', 6000, 2100, '2027-12-31'),
             ('Raya Trip', 1500, 960, '2027-03-15')) AS g(description, total_target, total_saving, date)
WHERE u.email = 'demo@vmax.app'
  AND NOT EXISTS (SELECT 1 FROM goals WHERE user_id = u.user_id);

INSERT INTO expenses (user_id, total_amount, description, category)
SELECT u.user_id, e.amount, e.description, e.category
FROM users u,
     (VALUES (42.50, 'Groceries at Jaya Grocer', 'Groceries'),
             (12.00, 'Grab to office', 'Transport'),
             (28.90, 'Nasi lemak & teh tarik', 'Food')) AS e(amount, description, category)
WHERE u.email = 'demo@vmax.app'
  AND NOT EXISTS (SELECT 1 FROM expenses WHERE user_id = u.user_id);
