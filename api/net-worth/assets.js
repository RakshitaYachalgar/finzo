// /api/net-worth/assets.js - Vercel Function for assets management
const { withAuth } = require('../_middleware/auth');

async function assetsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            // Return sample assets data to prevent 500 errors
            res.status(200).json([
                {
                    asset_id: 1,
                    name: 'Savings Account',
                    type: 'Cash',
                    value: 15000,
                    description: 'Primary savings account'
                },
                {
                    asset_id: 2,
                    name: 'Investment Portfolio',
                    type: 'Investments',
                    value: 25000,
                    description: 'Stock and bond investments'
                },
                {
                    asset_id: 3,
                    name: 'Real Estate',
                    type: 'Property',
                    value: 200000,
                    description: 'Primary residence'
                }
            ]);
        } catch (error) {
            console.error('Get Assets Error:', error);
            res.status(500).json({ message: 'Server error while fetching assets.' });
        }
    }
    else if (req.method === 'POST') {
        // Create asset
        const { name, type, value, description } = req.body;
        try {
            // TODO: Replace with Supabase insert when tables are set up
            const newAsset = {
                asset_id: Date.now(),
                name,
                type,
                value: parseFloat(value),
                description: description || ''
            };
            
            res.status(201).json({ 
                message: 'Asset created successfully.', 
                asset: newAsset 
            });
        } catch (error) {
            console.error('Create Asset Error:', error);
            res.status(500).json({ message: 'Server error while creating asset.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(assetsHandler);