const db = require('../config/db');

const getScope = (user) => {
    const { id: userId, active_org_id: orgId } = user;
    const scopeClause = orgId 
        ? `organization_id = $1` 
        : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;
    return { scopeClause, scopeValue, userId, orgId };
};

exports.getGoals = async (req, res) => {
    const { scopeClause, scopeValue } = getScope(req.user);
    try {
        const { rows } = await db.query(`SELECT * FROM goals WHERE ${scopeClause} ORDER BY target_date ASC`, [scopeValue]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get Goals Error:', error);
        res.status(500).json({ message: 'Server error while fetching goals.' });
    }
};

exports.createGoal = async (req, res) => {
    const { userId, orgId } = getScope(req.user);
    const { goal_name, target_amount, target_date } = req.body;
    if (!goal_name || !target_amount) {
        return res.status(400).json({ message: 'Goal name and target amount are required.' });
    }
    try {
        const { rows } = await db.query(
            `INSERT INTO goals (user_id, organization_id, goal_name, target_amount, target_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
            [userId, orgId, goal_name, target_amount, target_date || null]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Create Goal Error:', error);
        res.status(500).json({ message: 'Server error while creating goal.' });
    }
};

exports.updateGoal = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    const { add_amount } = req.body;

    if (!add_amount || isNaN(parseFloat(add_amount))) {
        return res.status(400).json({ message: 'A valid amount to add is required.' });
    }

    try {
        let query;
        let values;

        if (orgId) {
            query = `UPDATE goals SET current_amount = current_amount + $1 WHERE goal_id = $2 AND organization_id = $3 RETURNING *;`;
            values = [add_amount, req.params.goal_id, orgId];
        } else {
            query = `UPDATE goals SET current_amount = current_amount + $1 WHERE goal_id = $2 AND user_id = $3 AND organization_id IS NULL RETURNING *;`;
            values = [add_amount, req.params.goal_id, userId];
        }

        const { rows } = await db.query(query, values);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Goal not found or user not authorized.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Update Goal Error:', error);
        res.status(500).json({ message: 'Server error while updating goal.' });
    }
};

exports.deleteGoal = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    try {
        let query;
        let values;

        if (orgId) {
            query = `DELETE FROM goals WHERE goal_id = $1 AND organization_id = $2`;
            values = [req.params.goal_id, orgId];
        } else {
            query = `DELETE FROM goals WHERE goal_id = $1 AND user_id = $2 AND organization_id IS NULL`;
            values = [req.params.goal_id, userId];
        }
        
        const { rowCount } = await db.query(query, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Goal not found or user not authorized.' });
        }
        res.status(200).json({ message: 'Goal deleted successfully.' });
    } catch (error) {
        console.error('Delete Goal Error:', error);
        res.status(500).json({ message: 'Server error while deleting goal.' });
    }
};

