const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const packagesRoutes = require('./routes/packageRoutes');
const templateRoutes = require('./routes/templateRoutes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db'); 

dotenv.config();
connectDB(); 

const app = express();
app.use(bodyParser.json());

// API Routes
app.use('/api/emails', emailRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packagesRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app; // Export the app for Vercel
