const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        // Create new admin with plain text password
        const admin = new Admin({ username, password });
        await admin.save();
        
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Admin login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        // Compare plain-text password directly
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Invalid credentials: Password mismatch' });
        }

        // Generate JWT token with the admin's ID
        const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '365d' });

        // Send the token back in the response
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
