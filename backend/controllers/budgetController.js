const db = require('../config/db');

const getScope = (user) => {
    const { id: userId, active_org_id: orgId } = user;
    const scopeClause = orgId ? `organization_id = $1` : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;
    return { scopeClause, scopeValue, userId, orgId };
};

exports.getBudgets = async (req, res) => {
    const { scopeClause, scopeValue } = getScope(req.user);
    try {
        const { rows } = await db.query(`SELECT category_name, budget_amount FROM user_budgets WHERE ${scopeClause}`, [scopeValue]);
        const budgets = rows.reduce((acc, row) => {
            acc[row.category_name] = row.budget_amount;
            return acc;
        }, {});
        res.status(200).json(budgets);
    } catch (error) {
        console.error('Get Budgets Error:', error);
        res.status(500).json({ message: 'Server error while fetching budgets.' });
    }
};

exports.setBudgets = async (req, res) => {
    const { userId, orgId } = getScope(req.user);
    const { budgets } = req.body; 

    if (!budgets || typeof budgets !== 'object') {
        return res.status(400).json({ message: 'Invalid budgets format.' });
    }

    try {
        await db.query('BEGIN');
        for (const [category_name, budget_amount] of Object.entries(budgets)) {
            const query = `
                INSERT INTO user_budgets (user_id, organization_id, category_name, budget_amount)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (${orgId ? 'organization_id, category_name' : 'user_id, category_name'})
                DO UPDATE SET budget_amount = EXCLUDED.budget_amount;
            `;
            await db.query(query, [userId, orgId, category_name, budget_amount]);
        }
        await db.query('COMMIT');
        res.status(200).json({ message: 'Budgets updated successfully.' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Set Budgets Error:', error);
        res.status(500).json({ message: 'Server error while updating budgets.' });
    }
};
