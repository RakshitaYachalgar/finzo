// /api/net-worth/assets.js - Vercel Function for assets management
const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('../_middleware/auth');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function assetsHandler(req, res) {
    if (req.method === 'GET') {
        try {
            const userId = req.user.id;
            
            const { data: assets, error } = await supabase
                .from('assets')
                .select('asset_id, asset_name, asset_type, value')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Transform data to match frontend expectations
            const transformedAssets = assets.map(asset => ({
                asset_id: asset.asset_id,
                name: asset.asset_name,
                type: asset.asset_type,
                value: parseFloat(asset.value),
                description: asset.asset_name // Use name as description for now
            }));

            res.status(200).json(transformedAssets);
        } catch (error) {
            console.error('Get Assets Error:', error);
            res.status(500).json({ message: 'Server error while fetching assets.' });
        }
    }
    else if (req.method === 'POST') {
        // Create asset
        const { name, type, value, description } = req.body;
        try {
            const userId = req.user.id;
            
            const { data: newAsset, error } = await supabase
                .from('assets')
                .insert([{
                    user_id: userId,
                    asset_name: name,
                    asset_type: type,
                    value: parseFloat(value)
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }
            
            res.status(201).json({ 
                message: 'Asset created successfully.', 
                asset: {
                    asset_id: newAsset.asset_id,
                    name: newAsset.asset_name,
                    type: newAsset.asset_type,
                    value: parseFloat(newAsset.value),
                    description: newAsset.asset_name
                }
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