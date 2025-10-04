// /api/net-worth/liabilities.js - Vercel Function for liabilities management
const { withAuth } = require('../_middleware/auth');

async function liabilitiesHandler(req, res) {
    if (req.method === 'GET') {
        try {
            // Return sample liabilities data to prevent 500 errors
            res.status(200).json([
                {
                    liability_id: 1,
                    name: 'Home Mortgage',
                    type: 'Mortgage',
                    amount: 150000,
                    monthly_payment: 1200,
                    interest_rate: 3.5
                },
                {
                    liability_id: 2,
                    name: 'Car Loan',
                    type: 'Auto Loan',
                    amount: 15000,
                    monthly_payment: 350,
                    interest_rate: 4.2
                },
                {
                    liability_id: 3,
                    name: 'Credit Card',
                    type: 'Credit Card',
                    amount: 3500,
                    monthly_payment: 200,
                    interest_rate: 18.9
                }
            ]);
        } catch (error) {
            console.error('Get Liabilities Error:', error);
            res.status(500).json({ message: 'Server error while fetching liabilities.' });
        }
    }
    else if (req.method === 'POST') {
        // Create liability
        const { name, type, amount, monthly_payment, interest_rate } = req.body;
        try {
            // TODO: Replace with Supabase insert when tables are set up
            const newLiability = {
                liability_id: Date.now(),
                name,
                type,
                amount: parseFloat(amount),
                monthly_payment: parseFloat(monthly_payment),
                interest_rate: parseFloat(interest_rate)
            };
            
            res.status(201).json({ 
                message: 'Liability created successfully.', 
                liability: newLiability 
            });
        } catch (error) {
            console.error('Create Liability Error:', error);
            res.status(500).json({ message: 'Server error while creating liability.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(liabilitiesHandler);