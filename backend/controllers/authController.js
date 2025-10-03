// /backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, accountType } = req.body;

    if (!username || !password || !accountType) {
        return res.status(400).json({ message: 'Username, password, and account type are required.' });
    }
    if (!['personal', 'organization'].includes(accountType)) {
        return res.status(400).json({ message: "Account type must be 'personal' or 'organization'." });
    }

    try {
        const userExists = await db.query('SELECT 1 FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await db.query('BEGIN');

        
        const userQuery = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;';
        const { rows: userRows } = await db.query(userQuery, [username, password_hash]);
        const newUser = userRows[0];

        
        const inviteQuery = `SELECT * FROM invitations WHERE email = $1 AND status = 'Pending'`;
        const { rows: inviteRows } = await db.query(inviteQuery, [username]);

        if (inviteRows.length > 0) {
            
            const invitation = inviteRows[0];
            
            const orgUserQuery = `INSERT INTO organization_users (organization_id, user_id, role) VALUES ($1, $2, $3);`;
            await db.query(orgUserQuery, [invitation.organization_id, newUser.user_id, invitation.role]);

            await db.query('UPDATE users SET active_organization_id = $1 WHERE user_id = $2', [invitation.organization_id, newUser.user_id]);
            
            await db.query(`UPDATE invitations SET status = 'Accepted' WHERE invitation_id = $1`, [invitation.invitation_id]);

            await db.query('COMMIT');
            return res.status(201).json({ 
                message: `User created and automatically joined an organization!`,
                user: { user_id: newUser.user_id, username: newUser.username },
            });
        }
        
        if (accountType === 'organization') {
            const orgName = `${username}'s Organization`;
            const orgQuery = `INSERT INTO organizations (org_name, owner_id) VALUES ($1, $2) RETURNING *;`;
            const { rows: orgRows } = await db.query(orgQuery, [orgName, newUser.user_id]);
            const newOrg = orgRows[0];
            
            const orgUserQuery = `INSERT INTO organization_users (organization_id, user_id, role) VALUES ($1, $2, 'Admin');`;
            await db.query(orgUserQuery, [newOrg.organization_id, newUser.user_id]);
            
            await db.query('UPDATE users SET active_organization_id = $1 WHERE user_id = $2', [newOrg.organization_id, newUser.user_id]);
        }
        
        await db.query('COMMIT');
        const successMessage = accountType === 'organization' 
            ? "Organization account created successfully!" 
            : "Personal account created successfully!";

        return res.status(201).json({ message: successMessage });

    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: user.user_id,
                active_org_id: user.active_organization_id 
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

