const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP: Create a new user
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Basic Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // 2. Hash the password (never store plain text!)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create user in database
        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        // Handle duplicate email error
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Internal server error during signup" });
    }
};

// LOGIN: Verify user and return JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Create a JWT Token
        // This token contains the user's ID and is signed with your secret key
        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Send token to frontend
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error during login" });
    }
};