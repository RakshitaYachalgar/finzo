FinAnalyzer AI: Your Intelligent Personal & Business Finance Manager
FinAnalyzer AI is a full-stack, AI-powered web application designed to provide users with intelligent, automated insights into their financial health. It addresses the challenges of modern financial management by offering predictive forecasting, AI-driven advice, and collaborative tools for both individual and business users.

This project is a direct response to the FinTech challenge of bridging the gap between financial literacy and financial behavior, creating a tool for comprehensive financial empowerment.



✨ Key Features
The application offers two distinct, feature-rich dashboards tailored to the user's account type.



For Personal Finance:
-🤖 Smart Dashboards: Interactive pie and line charts to visualize spending breakdowns and historical trends.

-📊 Hybrid Data Entry: Upload transaction history via CSV or add individual cash expenses manually.

-🎯 Goal Setting & Tracking: Create financial goals, set target amounts, and visually track your progress.

-🏦 Net Worth Tracker: Log your assets and liabilities to get a real-time calculation of your total net worth.

-🧠 AI-Powered Insights:

  Custom Budget Analysis: Set your own spending limits and get personalized feedback on your performance.

  Expense Prediction: An AI model that forecasts your total spending for the upcoming month.

  Anomaly Detection: An intelligent scanner that alerts you to unusually large transactions that deviate from your normal habits.

-📄 PDF Reports: Download a professional, formatted PDF summary of your monthly finances.



For Small Businesses:
🏢 Multi-User Architecture: A secure, multi-tenant design that keeps each organization's data completely separate.

🤝 Team Management: Invite members to your organization via email and manage roles.

📊 Shared Financial Dashboard: All team members have access to a collaborative dashboard to track the organization's collective expenses.

✍️ Custom Categorization: Define your own business-specific expense categories (e.g., "Software Subscriptions," "Client Travel") for tailored AI categorization.

<img width="2048" height="1152" alt="image" padding= "10px" src="https://github.com/user-attachments/assets/15a93161-5168-402c-9c12-7c9c683b8d5c" />

🚀 Technology Stack & Architecture
-The application is built on a modern 3-tier microservices architecture, ensuring scalability, security, and maintainability.

-Frontend (React): A dynamic SPA built with React, styled with Tailwind CSS, and using Recharts for data visualization.

-Backend (Node.js & Express): The central API gateway that handles user authentication (JWT), business logic, and orchestrates communication between services.

-AI/ML Service (Python & Flask): A dedicated microservice that houses all machine learning models, built with Flask, Pandas, and Scikit-learn.

-Database (PostgreSQL): A robust relational database for all data storage, managed on Supabase.


🤖 The AI/ML Engine
-The intelligence of the application is driven by four distinct models:

-NLP Transaction Categorizer (Rule-Based Classifier): Automates the categorization of raw transaction descriptions. It's context-aware, prioritizing an organization's custom categories before falling back to a general-purpose dictionary.

-Expense Predictor (Linear Regression): Forecasts future spending based on past financial behavior.

-Anomaly Detector (Isolation Forest): An unsupervised learning model that analyzes both the amount and category of transactions to identify statistical outliers and potential fraud.

-Custom Budget Analyzer (Expert System): A dynamic system that provides personalized feedback by comparing a user's spending against their own custom-defined budgets.



🔧 Getting Started: Local Setup Guide
To run this project on your local machine, follow these steps:

-Prerequisites:
 Node.js and npm

-Python and pip

-PostgreSQL (running locally or a cloud instance)

1. Clone the Repository
git clone [https://github.com/RakshitaYachalgar/finzo.git]
cd finzo


2. Set Up the Database
Create a new PostgreSQL database.

Run the complete database/schema.sql script provided in this project to create all the necessary tables. This will set up the entire structure for users, transactions, goals, and organizations.

Important for Business Features: After the initial schema is set up, you may also need to run the following script to ensure all tables are correctly configured for multi-tenancy:

-- Add organization_id to all data tables to link data to a specific business.
-- This column will be NULL for personal finance users.
ALTER TABLE transactions ADD COLUMN organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE;
ALTER TABLE goals ADD COLUMN organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE;
ALTER TABLE assets ADD COLUMN organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE;
ALTER TABLE liabilities ADD COLUMN organization_id INTEGER REFERENCES organizations(organization_id) ON DELETE CASCADE;

3. Configure Backend
Navigate to the /backend directory: cd backend

Install dependencies: npm install

Create a .env file and add your database credentials and a JWT secret:

DB_USER=your_db_user
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key


Start the backend server: node server.js

4. Configure ML Service
Navigate to the /ml-service directory: cd ../ml-service

Install dependencies: pip install -r requirements.txt

Start the ML server: python ml_server.py

5. Configure Frontend
Navigate to the /frontend directory: cd ../frontend

Install dependencies: npm install

Start the frontend development server: npm start

You can now access the application at http://localhost:3000.
