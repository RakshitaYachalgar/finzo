// /backend/middleware/requireAuth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required.' });
    }

    const token = authorization.split(' ')[1]; // Bearer <token>

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the payload to the request object so controllers can access it
        req.user = payload.user; 
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        res.status(401).json({ message: 'Token is not valid.' });
    }
};

module.exports = requireAuth;
