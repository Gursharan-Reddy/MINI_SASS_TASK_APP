const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models/index'); 

const app = express();

// 1. Global Middlewares
app.use(cors());
app.use(express.json());

// 2. Route Definitions
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 3. Health Check Route (To verify server is alive)
app.get('/', (req, res) => res.send('Task SaaS Backend is running...'));

const PORT = process.env.PORT || 5000;

// 4. Proper Startup Sequence
const startApp = async () => {
    try {
        console.log('⏳ Connecting to Neon Database...');
        
        // This checks if the connection works
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // This syncs the models with the database
        await sequelize.sync({ alter: true });
        console.log('✅ Database tables synchronized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start the server:');
        console.error(error); // This will tell us exactly what went wrong
        process.exit(1); // Exit with failure
    }
};

startApp();