const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const query = `
            SELECT user_id, username, full_name, currency, avatar_url 
            FROM users 
            WHERE user_id = $1;
        `;
        const { rows } = await db.query(query, [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error while fetching profile.' });
    }
};

exports.updateProfile = async (req, res) => {
    const { fullName, currency, avatarUrl } = req.body;
    try {
        const query = `
            UPDATE users
            SET full_name = $1, currency = $2, avatar_url = $3
            WHERE user_id = $4
            RETURNING user_id, username, full_name, currency, avatar_url;
        `;
        const { rows } = await db.query(query, [fullName, currency, avatarUrl, req.user.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Profile updated successfully.', profile: rows[0] });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};
