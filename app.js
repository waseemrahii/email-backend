
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const templateRoutes = require('./routes/templateRoutes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db'); // Import the connectDB function

dotenv.config();


connectDB(); 

const app = express();

app.use(bodyParser.json());

// API Routes
app.use('/api/emails', emailRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
