// /api/budgets.js - Vercel Function for budget management
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./_middleware/auth');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function budgetsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            // Get user budgets
            const { data: budgets, error: budgetsError } = await supabase
                .from('user_budgets')
                .select('budget_id, category_name, budget_amount')
                .eq('user_id', userId);

            if (budgetsError) {
                throw budgetsError;
            }

            // Calculate spent amount for each category
            const budgetsWithSpent = await Promise.all(
                budgets.map(async (budget) => {
                    const { data: transactions, error: transError } = await supabase
                        .from('transactions')
                        .select('amount')
                        .eq('user_id', userId)
                        .eq('category', budget.category_name)
                        .lt('amount', 0); // Only negative amounts (expenses)

                    if (transError) {
                        console.error('Transaction error:', transError);
                        return {
                            budget_id: budget.budget_id,
                            category: budget.category_name,
                            amount: budget.budget_amount,
                            spent: 0,
                            remaining: budget.budget_amount
                        };
                    }

                    const spent = Math.abs(transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0));
                    const remaining = Math.max(0, budget.budget_amount - spent);

                    return {
                        budget_id: budget.budget_id,
                        category: budget.category_name,
                        amount: budget.budget_amount,
                        spent: spent,
                        remaining: remaining
                    };
                })
            );

            res.status(200).json(budgetsWithSpent);
        } catch (error) {
            console.error('Get Budgets Error:', error);
            res.status(500).json({ message: 'Server error while fetching budgets.' });
        }
    }
    else if (req.method === 'POST') {
        // Create budget
        const { category, amount } = req.body;
        try {
            const userId = req.user.id;
            
            const { data: newBudget, error } = await supabase
                .from('user_budgets')
                .insert([{
                    user_id: userId,
                    category_name: category,
                    budget_amount: parseFloat(amount)
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }
            
            res.status(201).json({ 
                message: 'Budget created successfully.', 
                budget: {
                    budget_id: newBudget.budget_id,
                    category: newBudget.category_name,
                    amount: newBudget.budget_amount,
                    spent: 0,
                    remaining: newBudget.budget_amount
                }
            });
        } catch (error) {
            console.error('Create Budget Error:', error);
            res.status(500).json({ message: 'Server error while creating budget.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(budgetsHandler);