const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models/index'); 

const app = express();

// 1. Global Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://mini-sass-task-app.vercel.app' // Removed '/dashboard'
  ],
  credentials: true
}));
app.use(express.json());

// 2. Route Definitions
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 3. Health Check Route
app.get('/', (req, res) => res.send('Task SaaS Backend is running...'));

const PORT = process.env.PORT || 5000;

// 4. Proper Startup Sequence
const startApp = async () => {
    try {
        console.log('⏳ Connecting to Neon Database...');
        
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // 'alter: true' is good for development to update tables automatically
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synchronized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start the server:');
        console.error(error);
        process.exit(1);
    }
};

startApp();