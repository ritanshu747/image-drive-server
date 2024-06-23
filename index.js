// index.js or app.js

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const database = require('./config/DB');
const imageSearchRouter = require('./routes/imageSearch');
const fileUploadRouter = require("./routes/fileUpload"); // Adjust as per your setup
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Connect to database
database();

// Middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'], // Adjust based on your frontend URL
    credentials: true,
}));

// Routes
app.use('/api/v1/auth', require('./routes/User')); // Example user routes
app.use('/api/v1/upload', fileUploadRouter); // Example upload routes
app.use('/api/v1/search', imageSearchRouter); // Route for image search

// Default route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Server is up and running...' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
