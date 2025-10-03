const db = require('../config/db');

const getScope = (user) => {
    const { id: userId, active_org_id: orgId } = user;
    const scopeClause = orgId 
        ? `organization_id = $1` 
        : `user_id = $1 AND organization_id IS NULL`;
    const scopeValue = orgId || userId;
    return { scopeClause, scopeValue, userId, orgId };
};

exports.getAssets = async (req, res) => {
    const { scopeClause, scopeValue } = getScope(req.user);
    try {
        const { rows } = await db.query(`SELECT * FROM assets WHERE ${scopeClause} ORDER BY asset_name ASC`, [scopeValue]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get Assets Error:', error);
        res.status(500).json({ message: 'Server error fetching assets.' });
    }
};

exports.createAsset = async (req, res) => {
    const { userId, orgId } = getScope(req.user);
    const { asset_name, asset_type, value } = req.body;
    if (!asset_name || !value) return res.status(400).json({ message: 'Asset name and value are required.' });
    try {
        const { rows } = await db.query(`INSERT INTO assets (user_id, organization_id, asset_name, asset_type, value) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [userId, orgId, asset_name, asset_type, value]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Create Asset Error:', error);
        res.status(500).json({ message: 'Server error creating asset.' });
    }
};

exports.deleteAsset = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    try {
        let query;
        let values;
        if (orgId) {
            query = `DELETE FROM assets WHERE asset_id = $1 AND organization_id = $2`;
            values = [req.params.asset_id, orgId];
        } else {
            query = `DELETE FROM assets WHERE asset_id = $1 AND user_id = $2 AND organization_id IS NULL`;
            values = [req.params.asset_id, userId];
        }
        const { rowCount } = await db.query(query, values);
        if (rowCount === 0) return res.status(404).json({ message: 'Asset not found or user not authorized.' });
        res.status(200).json({ message: 'Asset deleted successfully.' });
    } catch (error) {
        console.error('Delete Asset Error:', error);
        res.status(500).json({ message: 'Server error deleting asset.' });
    }
};

exports.getLiabilities = async (req, res) => {
    const { scopeClause, scopeValue } = getScope(req.user);
    try {
        const { rows } = await db.query(`SELECT * FROM liabilities WHERE ${scopeClause} ORDER BY liability_name ASC`, [scopeValue]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get Liabilities Error:', error);
        res.status(500).json({ message: 'Server error fetching liabilities.' });
    }
};

exports.createLiability = async (req, res) => {
    const { userId, orgId } = getScope(req.user);
    const { liability_name, liability_type, amount_owed } = req.body;
    if (!liability_name || !amount_owed) return res.status(400).json({ message: 'Liability name and amount are required.' });
    try {
        const { rows } = await db.query(`INSERT INTO liabilities (user_id, organization_id, liability_name, liability_type, amount_owed) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [userId, orgId, liability_name, liability_type, amount_owed]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Create Liability Error:', error);
        res.status(500).json({ message: 'Server error creating liability.' });
    }
};

exports.deleteLiability = async (req, res) => {
    const { id: userId, active_org_id: orgId } = req.user;
    try {
        let query;
        let values;
        if (orgId) {
            query = `DELETE FROM liabilities WHERE liability_id = $1 AND organization_id = $2`;
            values = [req.params.liability_id, orgId];
        } else {
            query = `DELETE FROM liabilities WHERE liability_id = $1 AND user_id = $2 AND organization_id IS NULL`;
            values = [req.params.liability_id, userId];
        }
        const { rowCount } = await db.query(query, values);
        if (rowCount === 0) return res.status(404).json({ message: 'Liability not found or user not authorized.' });
        res.status(200).json({ message: 'Liability deleted successfully.' });
    } catch (error) {
        console.error('Delete Liability Error:', error);
        res.status(500).json({ message: 'Server error deleting liability.' });
    }
};

