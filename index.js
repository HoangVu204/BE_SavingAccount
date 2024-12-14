const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB }  = require('./config/dbConfig');
const adminRoutes = require('./routes/admin/index.route')
const clientRoutes = require('./routes/client/index.route')


const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', clientRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});