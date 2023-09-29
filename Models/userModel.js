const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is a Required Field'],
        unique: true,
        minlength: [3, 'Username Cannot Be Less Than 3 Characters'],
        lowercase: true
    },
    emailAddress: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        validate: [validator.isEmail, 'Please Enter a Valid Email'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
        validate: {
            validator: function(val) {
                return val === this.password 
            },
            message: "Password Mis-Match"
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        select: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    };

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
