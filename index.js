const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB }  = require('./config/dbConfig');
const adminRoutes = require('./routes/admin/index.route')
const clientRoutes = require('./routes/client/index.route')
const cors = require('cors');
const corsUtil = require('./utils/corsOptions.util')

const app = express();
const PORT = process.env.PORT || 3002;

dotenv.config();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsUtil.corsOptions));


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', clientRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});