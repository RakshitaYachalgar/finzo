-- Sample data for testing user-specific financial dashboard
-- Execute this AFTER running the complete-database-schema.sql
-- Make sure to replace 'your-user-id' with actual user IDs from auth.users

-- Sample transactions for different users
-- Note: You'll need to replace these UUIDs with actual user IDs from your auth.users table

-- User 1 transactions (replace with actual user ID)
INSERT INTO transactions (user_id, transaction_date, description, amount, category) VALUES
('your-user-id-1', '2024-01-15', 'Salary Deposit', 5000.00, 'Income'),
('your-user-id-1', '2024-01-16', 'Grocery Shopping', -120.50, 'Food'),
('your-user-id-1', '2024-01-17', 'Gas Station', -45.00, 'Transportation'),
('your-user-id-1', '2024-01-18', 'Coffee Shop', -8.50, 'Food'),
('your-user-id-1', '2024-01-19', 'Rent Payment', -1200.00, 'Housing'),
('your-user-id-1', '2024-01-20', 'Freelance Income', 800.00, 'Income'),
('your-user-id-1', '2024-01-21', 'Utilities', -150.00, 'Housing'),
('your-user-id-1', '2024-01-22', 'Dining Out', -65.00, 'Food'),
('your-user-id-1', '2024-01-23', 'Online Shopping', -89.99, 'Shopping'),
('your-user-id-1', '2024-01-24', 'Investment Dividend', 125.00, 'Income');

-- User 2 transactions (replace with actual user ID)
INSERT INTO transactions (user_id, transaction_date, description, amount, category) VALUES
('your-user-id-2', '2024-01-15', 'Business Revenue', 8000.00, 'Income'),
('your-user-id-2', '2024-01-16', 'Office Supplies', -250.00, 'Business'),
('your-user-id-2', '2024-01-17', 'Client Lunch', -95.00, 'Business'),
('your-user-id-2', '2024-01-18', 'Software Subscription', -49.99, 'Business'),
('your-user-id-2', '2024-01-19', 'Office Rent', -2000.00, 'Business'),
('your-user-id-2', '2024-01-20', 'Marketing Campaign', -500.00, 'Business'),
('your-user-id-2', '2024-01-21', 'Equipment Purchase', -1200.00, 'Business'),
('your-user-id-2', '2024-01-22', 'Insurance Premium', -300.00, 'Business'),
('your-user-id-2', '2024-01-23', 'Professional Services', -750.00, 'Business'),
('your-user-id-2', '2024-01-24', 'Client Payment', 3500.00, 'Income');

-- Sample goals for different users
INSERT INTO goals (user_id, goal_name, target_amount, current_amount, target_date, status) VALUES
('your-user-id-1', 'Emergency Fund', 10000.00, 3500.00, '2024-12-31', 'In-Progress'),
('your-user-id-1', 'Vacation Fund', 3000.00, 800.00, '2024-06-30', 'In-Progress'),
('your-user-id-1', 'New Car Down Payment', 5000.00, 1200.00, '2024-09-30', 'In-Progress');

INSERT INTO goals (user_id, goal_name, target_amount, current_amount, target_date, status) VALUES
('your-user-id-2', 'Business Expansion', 50000.00, 15000.00, '2024-12-31', 'In-Progress'),
('your-user-id-2', 'Equipment Upgrade', 8000.00, 2500.00, '2024-08-31', 'In-Progress'),
('your-user-id-2', 'Marketing Budget', 12000.00, 4000.00, '2024-06-30', 'In-Progress');

-- Sample assets for different users
INSERT INTO assets (user_id, asset_name, asset_type, value) VALUES
('your-user-id-1', 'Checking Account', 'Cash', 2500.00),
('your-user-id-1', 'Savings Account', 'Cash', 8500.00),
('your-user-id-1', 'Investment Portfolio', 'Investments', 15000.00),
('your-user-id-1', '2018 Honda Civic', 'Vehicle', 18000.00);

INSERT INTO assets (user_id, asset_name, asset_type, value) VALUES
('your-user-id-2', 'Business Checking', 'Cash', 12000.00),
('your-user-id-2', 'Business Savings', 'Cash', 25000.00),
('your-user-id-2', 'Office Equipment', 'Equipment', 15000.00),
('your-user-id-2', 'Company Vehicle', 'Vehicle', 35000.00);

-- Sample liabilities for different users
INSERT INTO liabilities (user_id, liability_name, liability_type, amount_owed) VALUES
('your-user-id-1', 'Student Loan', 'Education', 25000.00),
('your-user-id-1', 'Credit Card', 'Credit', 3500.00);

INSERT INTO liabilities (user_id, liability_name, liability_type, amount_owed) VALUES
('your-user-id-2', 'Business Loan', 'Business', 45000.00),
('your-user-id-2', 'Equipment Financing', 'Equipment', 12000.00),
('your-user-id-2', 'Business Credit Card', 'Credit', 8500.00);

-- Sample budgets for different users
INSERT INTO user_budgets (user_id, category_name, budget_amount) VALUES
('your-user-id-1', 'Food', 400.00),
('your-user-id-1', 'Transportation', 200.00),
('your-user-id-1', 'Entertainment', 150.00),
('your-user-id-1', 'Shopping', 300.00),
('your-user-id-1', 'Housing', 1500.00);

INSERT INTO user_budgets (user_id, category_name, budget_amount) VALUES
('your-user-id-2', 'Business', 5000.00),
('your-user-id-2', 'Marketing', 1000.00),
('your-user-id-2', 'Equipment', 800.00),
('your-user-id-2', 'Professional Services', 1200.00);

-- Note: After creating real users through your application,
-- you'll need to update these 'your-user-id-1' and 'your-user-id-2' placeholders
-- with actual UUID values from the auth.users table