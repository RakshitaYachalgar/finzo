// server.js

// 1. Import Dependencies
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const netWorthRoutes = require('./routes/netWorthRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const profileRoutes = require('./routes/profileRoutes');
const setNoCache = require('./middleware/noCache'); // <-- IMPORT THE NEW MIDDLEWARE

// 2. Initialize the Express Application
const app = express();

// 3. Configure Middleware
app.use(cors());
app.use(express.json());
app.use(setNoCache); // <-- APPLY THE MIDDLEWARE GLOBALLY TO ALL ROUTES

// 4. Define a Port
const PORT = process.env.PORT || 5000;

// 5. Define API Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the Personal Finance Analyzer API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/net-worth', netWorthRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/profile', profileRoutes);

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

