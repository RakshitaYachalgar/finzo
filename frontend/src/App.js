import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import supabase from './supabaseClient';

async function getUsers() {
  let { data, error } = await supabase.from('users').select('*');
  console.log(data, error);
}

import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m16-10v10M9 4h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2zm4 4h.01M13 12h.01M13 16h.01M9 8h.01M9 12h.01M9 16h.01" /></svg>;
const InsightsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ReportsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const GoalsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7.43-7.43a2 2 0 012.83 0l7.43 7.43A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18M12 19v-4m-4-1h8" /></svg>;
const NetWorthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 16v1m0 1v1m0-2.01M12 20v-1m6-11a2 2 0 11-4 0 2 2 0 014 0zM6 9a2 2 0 11-4 0 2 2 0 014 0zM18 15a2 2 0 11-4 0 2 2 0 014 0zM6 15a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const TeamIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const BudgetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;


const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const Auth = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState('personal');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    if (isLogin) {
      try {
        const response = await axios.post(`https://finzo-sigma.vercel.app/api/auth/login`, { username, password });
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } catch (err) {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await axios.post(`https://finzo-sigma.vercel.app/api/auth/register`, { username, password, accountType });
        setMessage(response.data.message || 'User registered successfully! Please switch to login.');
        setIsLogin(true);
      } catch (err) {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="mt-2 text-sm text-center text-gray-400">{isLogin ? 'Sign in to continue' : 'Get started with your financial journey'}</p>
        </div>
        
        {!isLogin && (
          <div className="flex justify-center rounded-md bg-gray-700 p-1">
            <button 
              onClick={() => setAccountType('personal')}
              className={`w-full py-2 text-sm font-semibold rounded ${accountType === 'personal' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Personal
            </button>
            <button 
              onClick={() => setAccountType('organization')}
              className={`w-full py-2 text-sm font-semibold rounded ${accountType === 'organization' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              Business
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" placeholder="Username (Email)" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          {message && <p className="text-sm text-center text-green-400">{message}</p>}
          <div>
            <button type="submit" className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-indigo-400 hover:text-indigo-300">{isLogin ? 'Register' : 'Login'}</button>
        </p>
      </div>
    </div>
  );
};


const ManualTransactionForm = ({ token, onTransactionAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState('expense');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        let finalAmount = parseFloat(amount);
        if (type === 'expense') {
            finalAmount = -Math.abs(finalAmount);
        } else {
            finalAmount = Math.abs(finalAmount);
        }

        try {
            await axios.post('https://finzo-sigma.vercel.app/api/transactions/add', 
              { description, amount: finalAmount, date }, 
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('Transaction added successfully!');
            setDescription('');
            setAmount('');
            if (onTransactionAdded) onTransactionAdded();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add transaction.');
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Add a Transaction Manually</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Description (e.g., 'Coffee with friend')" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <div className="flex items-center space-x-4">
                    <input type="number" step="0.01" placeholder="Amount (e.g. 15.50)" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-1/2 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                     <div className="w-1/2 flex items-center justify-around">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="form-radio text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"/>
                            <span className="text-red-400">Expense</span>
                        </label>
                         <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="form-radio text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"/>
                            <span className="text-green-400">Income</span>
                        </label>
                    </div>
                </div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Add Transaction</button>
            </form>
            {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
    );
};

const FileUpload = ({ token, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('https://finzo-sigma.vercel.app/api/transactions/upload', formData, { 
          headers: { 
              'Content-Type': 'multipart/form-data', 
              'Authorization': `Bearer ${token}` 
          } 
      });
      setMessage(response.data.message);
      setFile(null);
      if(onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Upload CSV Statement</h2>
      <div className="flex items-center space-x-4">
        <label className="py-2 px-4 text-white font-semibold bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">
            Choose File
            <input type="file" className="hidden" onChange={handleFileChange} accept=".csv" disabled={isLoading} />
        </label>
        {file && <span className="text-gray-400 flex-1 truncate">{file.name}</span>}
        <button 
            onClick={handleUpload} 
            className="py-2 px-6 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isLoading || !file}
        >
            {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
};

const SummaryChart = ({ data }) => {
  const expense_columns = ['groceries', 'transport', 'eating_out', 'entertainment', 'utilities', 'healthcare', 'education', 'miscellaneous', 'rent', 'loan_repayment', 'insurance', 'shopping'];
  const chartData = expense_columns.map(key => ({ name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: parseFloat(data[key] || 0) })).filter(item => item.value > 0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19FFFF', '#FF5733', '#C70039', '#900C3F', '#581845'];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <h2 className="text-2xl font-semibold mb-4">Expense Breakdown</h2>
       {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-400">No expense data for this period.</div>
      )}
    </div>
  );
};

const Prediction = ({ token }) => {
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetPrediction = async () => {
        setIsLoading(true); setError(''); setPrediction(null);
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/api/transactions/predict', { headers: { 'Authorization': `Bearer ${token}` } });
            setPrediction(response.data.predicted_expenses);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get prediction.');
        } finally { setIsLoading(false); }
    };
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">AI Expense Predictor</h2>
            <p className="text-gray-400 mb-4">Get a forecast for next month's total expenses.</p>
            <button onClick={handleGetPrediction} disabled={isLoading} className="py-2 px-6 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500">{isLoading ? 'Calculating...' : 'Get Prediction'}</button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            {prediction !== null && <p className="mt-6 text-xl text-white">Predicted Expenses: <span className="font-bold text-green-400">${prediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>}
        </div>
    );
};

const HistoricalChart = ({ data }) => {
  const tracked_categories = ['groceries', 'eating_out', 'transport', 'entertainment', 'shopping', 'utilities', 'healthcare', 'rent'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19FFFF', '#FF5733'];

  const formattedData = data.map(record => {
    const date = new Date(record.month_year);
    const formattedMonth = date.toLocaleString('default', { month: 'short' });
    const formattedYear = date.getFullYear().toString().slice(-2);
    let processedRecord = { name: `${formattedMonth} '${formattedYear}` };
    tracked_categories.forEach(cat => { processedRecord[cat] = parseFloat(record[cat] || 0); });
    return processedRecord;
  });

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Historical Spending Trends</h2>
       <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name.replace(/_/g, ' ')]} contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} labelStyle={{ color: '#E2E8F0' }}/>
            <Legend />
            {tracked_categories.map((cat, index) => (<Line key={cat} type="monotone" dataKey={cat} stroke={COLORS[index % COLORS.length]} strokeWidth={2} name={cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}/>))}
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

const DownloadReport = ({ token }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async () => {
        setIsLoading(true); setError('');
        try {
            const response = await axios.get('http://localhost:5000/api/transactions/report', { headers: { 'Authorization': `Bearer ${token}` }, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'financial_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to download report. Please try again.');
        } finally { setIsLoading(false); }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Export Your Data</h2>
            <p className="text-gray-400 mb-4">Download a complete summary of your latest financial data as a PDF.</p>
            <button onClick={handleDownload} disabled={isLoading} className="py-2 px-6 text-white font-semibold bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-500">{isLoading ? 'Generating...' : 'Download Report'}</button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
    );
};

const GoalForm = ({ token, onGoalCreated }) => {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        console.log('Form submission started');
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        console.log('Form data:', { goalName, targetAmount, targetDate, token: token ? 'present' : 'missing' });
        
        try {
            console.log('Making API request...');
            const response = await axios.post('https://finzo-sigma.vercel.app/api/goals', 
                { goal_name: goalName, target_amount: targetAmount, target_date: targetDate },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log('API response:', response);
            
            setGoalName('');
            setTargetAmount('');
            setTargetDate('');
            onGoalCreated();
            setError('Goal created successfully!');
        } catch (err) {
            console.error('API error:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || 'Failed to create goal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Create a New Goal (Debug)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Goal Name (e.g., Vacation Fund)" 
                    value={goalName} 
                    onChange={e => setGoalName(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex space-x-4">
                    <input 
                        type="number" 
                        step="1" 
                        placeholder="Target Amount" 
                        value={targetAmount} 
                        onChange={e => setTargetAmount(e.target.value)} 
                        required 
                        className="w-1/2 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input 
                        type="date" 
                        value={targetDate} 
                        onChange={e => setTargetDate(e.target.value)} 
                        className="w-1/2 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-2 font-semibold text-white rounded-md ${
                        isSubmitting 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'Creating Goal...' : 'Set Goal'}
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-green-400">{error}</p>}
            
            {/* Debug info */}
            <div className="mt-4 p-2 bg-gray-700 rounded text-xs">
                <p>Debug Info:</p>
                <p>Goal Name: {goalName || 'empty'}</p>
                <p>Target Amount: {targetAmount || 'empty'}</p>
                <p>Target Date: {targetDate || 'empty'}</p>
                <p>Token: {token ? 'present' : 'missing'}</p>
            </div>
        </div>
    );
};

const GoalItem = ({ goal, token, onGoalUpdated, onGoalDeleted }) => {
    const [addAmount, setAddAmount] = useState('');
    const progress = Math.min((parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100, 100);

    const handleAddFunds = async () => {
        if (!addAmount || parseFloat(addAmount) <= 0) return;
        try {
            await axios.put(`https://finzo-sigma.vercel.app/api/goals/${goal.goal_id}`, 
                { add_amount: addAmount }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setAddAmount('');
            onGoalUpdated();
        } catch (error) {
            console.error("Failed to add funds:", error);
        }
    };
    
    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await axios.delete(`https://finzo-sigma.vercel.app/api/goals/${goal.goal_id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                onGoalDeleted();
            } catch (error) {
                console.error("Failed to delete goal:", error);
            }
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold">{goal.goal_name}</h3>
                    <p className="text-green-400 font-semibold">${parseFloat(goal.current_amount).toLocaleString()} / <span className="text-gray-400">${parseFloat(goal.target_amount).toLocaleString()}</span></p>
                    {goal.target_date && <p className="text-sm text-gray-500">Target: {new Date(goal.target_date).toLocaleDateString()}</p>}
                </div>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-400 text-2xl leading-none">&times;</button>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex space-x-2 mt-4">
                <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="Add funds" className="w-full px-3 py-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <button onClick={handleAddFunds} className="py-1 px-4 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add</button>
            </div>
        </div>
    );
};

const AnomalyDetector = ({ token }) => {
    const [anomalies, setAnomalies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDetectAnomalies = async () => {
        setIsLoading(true); setError(''); setAnomalies([]);
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/transactions/anomalies', { headers: { 'Authorization': `Bearer ${token}` } });
            setAnomalies(response.data.anomalies);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to detect anomalies.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Unusual Spending Detector</h2>
            <p className="text-gray-400 mb-4">Scan your transaction history for spending that is unusually high compared to your habits.</p>
            <button onClick={handleDetectAnomalies} disabled={isLoading} className="py-2 px-6 text-white font-semibold bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-500">
                {isLoading ? 'Scanning...' : 'Scan for Anomalies'}
            </button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            <div className="mt-6">
                {isLoading && <p className="text-gray-400">Analyzing transactions...</p>}
                {!isLoading && anomalies.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-yellow-400 mb-2">Potential Anomalies Detected:</h3>
                        <ul className="space-y-2">
                            {anomalies.map(anomaly => (
                                <li key={anomaly.transaction_id} className="p-3 bg-gray-700 rounded-md">
                                    <p className="font-semibold">{anomaly.description}</p>
                                    <p className="text-red-400 text-lg font-bold">${Math.abs(anomaly.amount).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">{new Date(anomaly.transaction_date).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                 {!isLoading && anomalies.length === 0 && !error && <p className="text-gray-400">No anomalies detected after the last scan.</p>}
            </div>
        </div>
    );
};

const NetWorthForm = ({ type, token, onUpdate }) => {
    const [name, setName] = useState('');
    const [itemType, setItemType] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const isAsset = type === 'asset';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isAsset ? '/api/net-worth/assets' : '/api/net-worth/liabilities';
        const payload = isAsset 
            ? { asset_name: name, asset_type: itemType, value: value }
            : { liability_name: name, liability_type: itemType, amount_owed: value };
        
        try {
            await axios.post(`https://finzo-sigma.vercel.app/${endpoint}`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
            setName('');
            setItemType('');
            setValue('');
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to add ${type}.`);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Add New {isAsset ? 'Asset' : 'Liability'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder={isAsset ? "Asset Name (e.g., Savings Account)" : "Liability Name (e.g., Student Loan)"} value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <input type="text" placeholder={isAsset ? "Type (e.g., Bank, Investment)" : "Type (e.g., Loan, Credit Card)"} value={itemType} onChange={e => setItemType(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <input type="number" step="0.01" placeholder={isAsset ? "Current Value" : "Amount Owed"} value={value} onChange={e => setValue(e.target.value)} required className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Add {isAsset ? 'Asset' : 'Liability'}</button>
            </form>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
};

const NetWorthList = ({ title, items, type, token, onUpdate }) => {
    const isAsset = type === 'asset';
    const total = items.reduce((sum, item) => sum + parseFloat(isAsset ? item.value : item.amount_owed), 0);

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        const endpoint = isAsset ? `/api/net-worth/assets/${id}` : `/api/net-worth/liabilities/${id}`;
        try {
            await axios.delete(`https://finzo-sigma.vercel.app/${endpoint}`, { headers: { 'Authorization': `Bearer ${token}` } });
            onUpdate();
        } catch (err) {
            console.error(`Failed to delete ${type}:`, err);
        }
    };
    
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">{title} - <span className={isAsset ? "text-green-400" : "text-red-400"}>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></h2>
            <ul className="space-y-3">
                {items.map(item => (
                    <li key={isAsset ? item.asset_id : item.liability_id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                        <div>
                            <p className="font-semibold">{isAsset ? item.asset_name : item.liability_name}</p>
                            <p className="text-sm text-gray-400">{isAsset ? item.asset_type : item.liability_type}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <p className="font-bold">${parseFloat(isAsset ? item.value : item.amount_owed).toLocaleString()}</p>
                            <button onClick={() => handleDelete(isAsset ? item.asset_id : item.liability_id)} className="text-gray-500 hover:text-red-400 text-xl">&times;</button>
                        </div>
                    </li>
                ))}
                 {items.length === 0 && <p className="text-gray-500">No {type}s added yet.</p>}
            </ul>
        </div>
    );
};


const PersonalSidebar = ({ activeView, setActiveView, setToken }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'dataEntry', label: 'Data Entry', icon: <DataIcon /> },
        { id: 'budgets', label: 'Budgets', icon: <BudgetIcon /> },
        { id: 'goals', label: 'Goals', icon: <GoalsIcon /> },
        { id: 'netWorth', label: 'Net Worth', icon: <NetWorthIcon /> },
        { id: 'insights', label: 'AI Insights', icon: <InsightsIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
        { id: 'profile', label: 'Profile', icon: <ProfileIcon /> },
    ];
    
    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    return (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
            <div>
                <div className="text-white text-2xl font-bold mb-8 px-3">FinAnalyzer AI</div>
                <nav className="flex flex-col space-y-2">
                    {menuItems.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <button onClick={handleLogout} className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
        </aside>
    );
};

const DashboardView = ({ summaryData, historicalData }) => (
    <>
        {summaryData && Object.values(summaryData).some(v => v > 0) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2"><SummaryChart data={summaryData} /></div>
                {historicalData && historicalData.length > 1 && (
                    <div className="lg:col-span-2"><HistoricalChart data={historicalData} /></div>
                )}
            </div>
        ) : (
            <div className="text-center p-8 bg-gray-800 rounded-xl h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-semibold">Welcome to Your Dashboard!</h2>
                <p className="text-gray-400 mt-2">Go to the 'Data Entry' or 'Budgets' section to get started.</p>
            </div>
        )}
    </>
);

const DataEntryView = ({ token, fetchData }) => (
    <div className="grid grid-cols-1 gap-8">
        <FileUpload token={token} onUploadSuccess={fetchData} />
        <ManualTransactionForm token={token} onTransactionAdded={fetchData} />
    </div>
);

const BudgetsView = ({ token }) => {
    const [budgets, setBudgets] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const expenseCategories = ['Groceries', 'Transport', 'Food & Drinks', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Rent/Mortgage', 'Miscellaneous'];

    const fetchBudgets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/api/budgets', { headers: { Authorization: `Bearer ${token}` } });
            setBudgets(response.data);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    const handleBudgetChange = (category, amount) => {
        setBudgets(prev => ({ ...prev, [category]: amount }));
    };

    const handleSaveBudgets = async () => {
        try {
            await axios.post('https://finzo-sigma.vercel.app/api/budgets', { budgets }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Budgets saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save budgets", error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Set Your Monthly Budgets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenseCategories.map(category => (
                    <div key={category} className="flex flex-col">
                        <label className="text-gray-400 mb-1">{category}</label>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={budgets[category] || ''}
                            onChange={e => handleBudgetChange(category, e.target.value)}
                            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end items-center">
                 {message && <p className="text-green-400 mr-4">{message}</p>}
                <button onClick={handleSaveBudgets} className="py-2 px-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Save Budgets
                </button>
            </div>
        </div>
    );
};

const BudgetAnalysis = ({ token, summaryData }) => {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetAnalysis = async () => {
        setIsLoading(true); setError(''); setAnalysis(null);
        try {
            const budgetResponse = await axios.get('https://finzo-sigma.vercel.app/api/budgets', { headers: { 'Authorization': `Bearer ${token}` } });
            const payload = {
                spending: summaryData,
                budgets: budgetResponse.data
            };
            const response = await axios.post('https://finzo-sigma.vercel.app/api/transactions/recommend_budget', payload, { headers: { 'Authorization': `Bearer ${token}` } });
            setAnalysis(response.data);
        } catch (err) { setError(err.response?.data?.message || 'Failed to get analysis.'); } finally { setIsLoading(false); }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Budget Analysis</h2>
            <p className="text-gray-400 mb-4">Analyze your spending against your custom budgets.</p>
            <button onClick={handleGetAnalysis} disabled={isLoading} className="py-2 px-6 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500">{isLoading ? 'Analyzing...' : 'Analyze Spending'}</button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            {analysis && (
                 <div className="mt-6 space-y-4 text-white">
                    <h3 className="text-xl font-semibold">Spending vs. Budget:</h3>
                     <div className="space-y-3">
                        {Object.entries(analysis.budget_summary).map(([key, value]) => (
                             <div key={key}>
                                 <div className="flex justify-between font-semibold">
                                     <span>{key}</span>
                                     <span>${value.spent.toFixed(2)} / <span className="text-gray-400">${value.budget.toFixed(2)}</span></span>
                                 </div>
                                 <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                     <div className={`h-2.5 rounded-full ${value.spent > value.budget ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${value.budget > 0 ? Math.min((value.spent / value.budget) * 100, 100) : 0}%` }}></div>
                                 </div>
                             </div>
                        ))}
                    </div>
                    <h3 className="text-xl font-semibold mt-6">Recommendations:</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {analysis.recommendations && analysis.recommendations.map((rec, index) => (<li key={index}>{rec}</li>))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const InsightsView = ({ token, summaryData }) => (
    summaryData && Object.values(summaryData).some(v => v > 0) ? (
        <div className="grid grid-cols-1 gap-8">
            <BudgetAnalysis token={token} summaryData={summaryData} />
            <Prediction token={token} />
            <AnomalyDetector token={token} />
        </div>
    ) : (
        <div className="text-center p-8 bg-gray-800 rounded-xl">
             <h2 className="text-2xl font-semibold">No Data for Insights</h2>
             <p className="text-gray-400 mt-2">Please add some transaction data first to enable AI insights.</p>
        </div>
    )
);

const ReportsView = ({ token, summaryData }) => (
     summaryData && Object.values(summaryData).some(v => v > 0) ? <DownloadReport token={token} /> : (
        <div className="text-center p-8 bg-gray-800 rounded-xl">
             <h2 className="text-2xl font-semibold">No Data for Reports</h2>
             <p className="text-gray-400 mt-2">Please add some transaction data first to generate a report.</p>
        </div>
    )
);

const ProfileView = ({ token }) => {
    const [profile, setProfile] = useState({ full_name: '', currency: 'USD', avatar_url: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await axios.put('https://finzo-sigma.vercel.app/api/profile', {
                fullName: profile.full_name,
                currency: profile.currency,
                avatarUrl: profile.avatar_url
            }, { headers: { 'Authorization': `Bearer ${token}` } });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-white">Manage Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 flex flex-col items-center space-y-4">
                    <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-gray-600 shadow-lg">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://i.pravatar.cc/150"; }} />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                             <ProfileIcon />
                           </div>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold text-white">{profile.full_name || 'Your Name'}</p>
                        <p className="text-gray-400">{profile.username}</p>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">Full Name</label>
                            <input 
                                type="text" 
                                name="full_name" 
                                value={profile.full_name || ''} 
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 font-semibold">Preferred Currency</label>
                            <select 
                                name="currency" 
                                value={profile.currency || 'USD'} 
                                onChange={handleChange} 
                                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="USD">USD - United States Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="INR">INR - Indian Rupee</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-gray-400 mb-2 font-semibold">Avatar URL</label>
                            <input 
                                type="text" 
                                name="avatar_url" 
                                value={profile.avatar_url || ''} 
                                onChange={handleChange} 
                                placeholder="https://example.com/your-image.png" 
                                className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                         <div className="flex justify-end items-center pt-4">
                            {message && <p className="text-green-400 mr-4 transition-opacity duration-300">{message}</p>}
                            <button type="submit" className="py-2 px-8 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


const GoalsView = ({ token }) => {
    const [goals, setGoals] = useState([]);
    
    const fetchGoals = useCallback(async () => {
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/api/goals', { headers: { 'Authorization': `Bearer ${token}` } });
            setGoals(response.data);
        } catch (error) {
            console.error("Failed to fetch goals", error);
        }
    }, [token]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GoalItem key={goal.goal_id} goal={goal} token={token} onGoalUpdated={fetchGoals} onGoalDeleted={fetchGoals}/>
                ))}
            </div>
            <GoalForm token={token} onGoalCreated={fetchGoals} />
        </div>
    );
};

const NetWorthView = ({ token }) => {
    const [assets, setAssets] = useState([]);
    const [liabilities, setLiabilities] = useState([]);

    const fetchNetWorthData = useCallback(async () => {
        try {
            const [assetsRes, liabilitiesRes] = await Promise.all([
                axios.get('https://finzo-sigma.vercel.app/api/net-worth/assets', { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get('https://finzo-sigma.vercel.app/api/net-worth/liabilities', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setAssets(assetsRes.data);
            setLiabilities(liabilitiesRes.data);
        } catch (error) {
            console.error("Failed to fetch net worth data", error);
        }
    }, [token]);

    useEffect(() => {
        fetchNetWorthData();
    }, [fetchNetWorthData]);

    const totalAssets = assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount_owed), 0);
    const netWorth = totalAssets - totalLiabilities;

    return (
        <div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 text-center">
                <h2 className="text-xl text-gray-400 font-semibold">Total Net Worth</h2>
                <p className={`text-5xl font-bold mt-2 ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <NetWorthList title="Assets" items={assets} type="asset" token={token} onUpdate={fetchNetWorthData} />
                    <NetWorthForm type="asset" token={token} onUpdate={fetchNetWorthData} />
                </div>
                 <div>
                    <NetWorthList title="Liabilities" items={liabilities} type="liability" token={token} onUpdate={fetchNetWorthData} />
                    <NetWorthForm type="liability" token={token} onUpdate={fetchNetWorthData} />
                </div>
            </div>
        </div>
    );
};


const TeamManagementView = ({ token }) => {
    const [members, setMembers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://finzo-sigma.vercel.app/api/organizations/members', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (err) {
            setError('Could not load team members.');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('https://finzo-sigma.vercel.app/api/organizations/invite', 
                { email: inviteEmail, role: 'Member' },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setInviteEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send invitation.');
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
                <ul className="space-y-3">
                    {members.map(member => (
                        <li key={member.user_id} className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                            <p className="font-semibold">{member.username}</p>
                            <span className="text-sm font-medium bg-indigo-500 text-white px-2 py-1 rounded-full">{member.role}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Invite New Member</h2>
                <form onSubmit={handleInvite} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Enter member's email" 
                        value={inviteEmail} 
                        onChange={e => setInviteEmail(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Send Invitation</button>
                </form>
                {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </div>
        </div>
    );
};

const BusinessSidebar = ({ activeView, setActiveView, setToken }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'dataEntry', label: 'Data Entry', icon: <DataIcon /> },
        { id: 'team', label: 'Team', icon: <TeamIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    ];
    
    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    return (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
            <div>
                <div className="text-white text-2xl font-bold mb-8 px-3">Business Panel</div>
                <nav className="flex flex-col space-y-2">
                    {menuItems.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <button onClick={handleLogout} className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
        </aside>
    );
};

// --- Main Layout Components ---
const PersonalDashboard = ({ token, setToken }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryRes, historyRes] = await Promise.all([
        axios.get('https://finzo-sigma.vercel.app/api/transactions/summary', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('https://finzo-sigma.vercel.app/api/transactions/history', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setSummaryData(summaryRes.data);
      setHistoricalData(historyRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setToken('');
        localStorage.removeItem('token');
      }
      console.error('Failed to fetch dashboard data:', error);
    } finally {
        setIsLoading(false);
    }
  }, [token, setToken]); 

  useEffect(() => {
    if (token) { fetchData(); }
  }, [fetchData, token]);
  
  const renderView = () => {
      if (isLoading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
      
      switch(activeView) {
          case 'dashboard': return <DashboardView summaryData={summaryData} historicalData={historicalData} />;
          case 'dataEntry': return <DataEntryView token={token} fetchData={fetchData} />;
          case 'budgets': return <BudgetsView token={token} />;
          case 'goals': return <GoalsView token={token} />;
          case 'netWorth': return <NetWorthView token={token} />;
          case 'insights': return <InsightsView token={token} summaryData={summaryData} />;
          case 'reports': return <ReportsView token={token} summaryData={summaryData} />;
          case 'profile': return <ProfileView token={token} />;
          default: return <DashboardView summaryData={summaryData} historicalData={historicalData} />;
      }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <PersonalSidebar activeView={activeView} setActiveView={setActiveView} setToken={setToken} />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold capitalize">{activeView.replace(/([A-Z])/g, ' $1')}</h1>
        </header>
        <main>{renderView()}</main>
      </div>
    </div>
  );
};

const BusinessDashboard = ({ token, setToken, userPayload }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryRes, historyRes] = await Promise.all([
        axios.get('https://finzo-sigma.vercel.app/api/transactions/summary', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('https://finzo-sigma.vercel.app/api/transactions/history', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setSummaryData(summaryRes.data);
      setHistoricalData(historyRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setToken('');
        localStorage.removeItem('token');
      }
      console.error('Failed to fetch business dashboard data:', error);
    } finally {
        setIsLoading(false);
    }
  }, [token, setToken]);

  useEffect(() => {
      if (token) { fetchData(); }
  }, [token, fetchData]);
  
  const renderView = () => {
    if (isLoading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    
    switch(activeView) {
      case 'team':
        return <TeamManagementView token={token} />;
      case 'dataEntry':
        return <DataEntryView token={token} fetchData={fetchData} />;
      case 'reports':
        return <ReportsView token={token} summaryData={summaryData} />;
      case 'dashboard':
      default:
        return <DashboardView summaryData={summaryData} historicalData={historicalData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <BusinessSidebar activeView={activeView} setActiveView={setActiveView} setToken={setToken} />
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold capitalize">{activeView.replace(/([A-Z])/g, ' $1')}</h1>
        </header>
        <main>{renderView()}</main>
      </div>
    </div>
  );
};

// --- App Component ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userPayload, setUserPayload] = useState(token ? decodeToken(token)?.user : null);

  useEffect(() => {
      if(token){
          setUserPayload(decodeToken(token)?.user);
      } else {
          setUserPayload(null);
      }
  }, [token]);

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return userPayload?.active_org_id ? 
    <BusinessDashboard token={token} setToken={setToken} userPayload={userPayload} /> : 
    <PersonalDashboard token={token} setToken={setToken} />;
}

export default App;

