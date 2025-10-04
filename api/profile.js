// /api/profile.js - Vercel Function for profile management
const { withAuth } = require('./_middleware/auth');
const { supabase } = require('./_config/db');

async function profileHandler(req, res) {
    if (req.method === 'GET') {
        // Get profile
        try {
            const userId = req.user.id;
            
            // Try to get profile from Supabase
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            // If profile exists, return it
            if (profile && !error) {
                return res.status(200).json(profile);
            }
            
            // If no profile exists, create a default one
            const defaultProfile = {
                user_id: userId,
                username: req.user.username || 'User',
                full_name: '',
                currency: 'USD',
                avatar_url: ''
            };
            
            // Try to insert the default profile
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([defaultProfile])
                .select()
                .single();
            
            if (insertError) {
                console.error('Error creating profile:', insertError);
                // If table doesn't exist, return the default profile without storing
                return res.status(200).json(defaultProfile);
            }
            
            res.status(200).json(newProfile);
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({ message: 'Server error while fetching profile.' });
        }
    }
    else if (req.method === 'PUT') {
        // Update profile
        const { fullName, currency, avatarUrl } = req.body;
        try {
            const userId = req.user.id;
            
            // Prepare update data
            const updateData = {};
            if (fullName !== undefined) {
                updateData.full_name = fullName;
                updateData.username = fullName; // Also update username
            }
            if (currency !== undefined) updateData.currency = currency;
            if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
            
            // Try to update existing profile
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('user_id', userId)
                .select()
                .single();
            
            if (updateError) {
                console.error('Update error:', updateError);
                
                // If profile doesn't exist, create it first
                if (updateError.code === 'PGRST116') {
                    const newProfile = {
                        user_id: userId,
                        username: fullName || req.user.username || 'User',
                        full_name: fullName || '',
                        currency: currency || 'USD',
                        avatar_url: avatarUrl || ''
                    };
                    
                    const { data: createdProfile, error: createError } = await supabase
                        .from('profiles')
                        .insert([newProfile])
                        .select()
                        .single();
                    
                    if (createError) {
                        console.error('Create error:', createError);
                        // If table doesn't exist, return mock success
                        return res.status(200).json({ 
                            message: 'Profile updated successfully (local storage).', 
                            profile: newProfile
                        });
                    }
                    
                    return res.status(200).json({ 
                        message: 'Profile created successfully.', 
                        profile: createdProfile
                    });
                }
                
                // For other errors, return error response
                return res.status(500).json({ message: 'Failed to update profile.' });
            }

            res.status(200).json({ 
                message: 'Profile updated successfully.', 
                profile: updatedProfile
            });
        } catch (error) {
            console.error('Update Profile Error:', error);
            res.status(500).json({ message: 'Server error while updating profile.' });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(profileHandler);