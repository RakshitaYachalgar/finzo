// /api/net-worth/liabilities.js - Vercel Function for liabilities management
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function liabilitiesHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            const { data: liabilities, error } = await supabase
                .from('liabilities')
                .select('liability_id, liability_name, liability_type, amount_owed')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Transform data to match frontend expectations
            const transformedLiabilities = liabilities.map(liability => ({
                liability_id: liability.liability_id,
                name: liability.liability_name,
                type: liability.liability_type,
                amount: parseFloat(liability.amount_owed),
                monthly_payment: Math.round(parseFloat(liability.amount_owed) * 0.02), // Estimate 2% monthly
                interest_rate: 5.0 // Default interest rate
            }));

            res.status(200).json(transformedLiabilities);
        } catch (error) {
            console.error('Get Liabilities Error:', error);
            res.status(500).json({ message: 'Server error while fetching liabilities.' });
        }
    }
    else if (req.method === 'POST') {
        // Create liability
        const { name, type, amount, monthly_payment, interest_rate } = req.body;
        try {
            const userId = req.user.id;
            
            const { data: newLiability, error } = await supabase
                .from('liabilities')
                .insert([{
                    user_id: userId,
                    liability_name: name,
                    liability_type: type,
                    amount_owed: parseFloat(amount)
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }
            
            res.status(201).json({ 
                message: 'Liability created successfully.', 
                liability: {
                    liability_id: newLiability.liability_id,
                    name: newLiability.liability_name,
                    type: newLiability.liability_type,
                    amount: parseFloat(newLiability.amount_owed),
                    monthly_payment: parseFloat(monthly_payment) || Math.round(parseFloat(newLiability.amount_owed) * 0.02),
                    interest_rate: parseFloat(interest_rate) || 5.0
                }
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