const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    mobileNo: {
        type: String,
        trim: true, 
        required: true
    },
    address: {
        type: String,
    },
    time: {
        type:String
    },
    date: {
        type: String
    },
});


const User= mongoose.model('User', userSchema);

module.exports =User;