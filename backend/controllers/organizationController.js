const db = require('../config/db');

exports.createOrganization = async (req, res) => {
    const { org_name } = req.body;
    const owner_id = req.user.id;

    if (!org_name) {
        return res.status(400).json({ message: 'Organization name is required.' });
    }

    try {
        await db.query('BEGIN');

        const orgQuery = `INSERT INTO organizations (org_name, owner_id) VALUES ($1, $2) RETURNING *;`;
        const { rows: orgRows } = await db.query(orgQuery, [org_name, owner_id]);
        const newOrg = orgRows[0];

        const orgUserQuery = `INSERT INTO organization_users (organization_id, user_id, role) VALUES ($1, $2, 'Admin');`;
        await db.query(orgUserQuery, [newOrg.organization_id, owner_id]);

        await db.query('UPDATE users SET active_organization_id = $1 WHERE user_id = $2', [newOrg.organization_id, owner_id]);

        await db.query('COMMIT');
        res.status(201).json(newOrg);
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Create Organization Error:', error);
        res.status(500).json({ message: 'Server error while creating organization.' });
    }
};


exports.inviteUser = async (req, res) => {
    const { email, role } = req.body;
    const organization_id = req.user.active_org_id; 
    const inviter_id = req.user.id;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    if (!organization_id) {
        return res.status(400).json({ message: 'You are not part of an active organization.'});
    }

    try {
        const adminCheck = await db.query(
            'SELECT role FROM organization_users WHERE user_id = $1 AND organization_id = $2',
            [inviter_id, organization_id]
        );

        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'Admin') {
            return res.status(403).json({ message: 'Only admins can invite new users.' });
        }

        const query = `
            INSERT INTO invitations (organization_id, email, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (organization_id, email) DO NOTHING
            RETURNING *;
        `;
        const { rows } = await db.query(query, [organization_id, email, role || 'Member']);
        
        if (rows.length === 0) {
            return res.status(409).json({ message: 'An invitation for this email already exists for this organization.' });
        }

        res.status(201).json({ message: 'Invitation sent successfully.', invitation: rows[0] });

    } catch (error) {
        console.error('Invite User Error:', error);
        res.status(500).json({ message: 'Server error while sending invitation.' });
    }
};

exports.getMembers = async (req, res) => {
    const organization_id = req.user.active_org_id;

    if (!organization_id) {
        return res.status(400).json({ message: 'You are not part of an active organization.'});
    }

    try {
        const query = `
            SELECT u.user_id, u.username, ou.role 
            FROM users u
            JOIN organization_users ou ON u.user_id = ou.user_id
            WHERE ou.organization_id = $1;
        `;
        const { rows } = await db.query(query, [organization_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get Members Error:', error);
        res.status(500).json({ message: 'Server error while fetching members.' });
    }
};

