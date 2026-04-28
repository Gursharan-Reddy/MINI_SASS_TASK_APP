const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Internal server error during signup" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error during login" });
    }
};