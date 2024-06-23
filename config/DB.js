const mongoose = require('mongoose');
require('dotenv').config();

const DbConnection = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Database connection failed")
        console.log(error.message);
        process.exit(1);
    });
};

module.exports = DbConnection;
