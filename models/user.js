const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
   
    password: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    },

  
    token: {
        type : String,
    },
});

module.exports = mongoose.model("User", userSchema);
