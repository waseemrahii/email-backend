const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const packagesRoutes = require('./routes/packageRoutes');
const templateRoutes = require('./routes/templateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db'); 

dotenv.config();
connectDB();

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: '*',  // Allows all origins, but only for testing
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(bodyParser.json());

// API Routes
app.use('/api/emails', emailRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Set up the server to listen on a specific port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
