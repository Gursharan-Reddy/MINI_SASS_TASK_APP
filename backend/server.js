const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models/index'); 

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://mini-sass-task-app.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => res.send('Task SaaS Backend is running...'));

const PORT = process.env.PORT || 5000;

const startApp = async () => {
    try {
        console.log('Connecting to Neon Database...');
        
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ alter: true });
        console.log('Database tables synchronized.');

        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the server:');
        console.error(error);
        process.exit(1);
    }
};

startApp();