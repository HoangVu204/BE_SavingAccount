const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB }  = require('./config/dbConfig');
const authRoutes = require('./routes/auth.route')


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});