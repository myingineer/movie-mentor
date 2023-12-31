const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetTokenExpire: {
        type: Date,
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

userSchema.methods.comparePasswords = async function(password, dbpassword) {
    return await bcrypt.compare(password, dbpassword);
};

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp) {
    if (this.passwordChangedAt) {
        // Converting the passwordChangedAt date to a timestamp in seconds and base 10
        const pswdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimeStamp < pswdChangedTimeStamp;// If the password was changed after JWT was issued, we want to return true
    };
    return false; // Password wasn't changed
};

userSchema.methods.createResetPasswordToken = async function() {
    // We are creating a reset token using the crypto library
    // And we are using 32 byte long string and converting it to hexadecimal
    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    // We are encrypting the token because for each reset token, the token is saved in the db
    // And we do not want hackers to have access to it
    this.passwordResetToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');
    // We are setting the time for the token to expire in milliseconds
    // Which is 10 minutes from when it was requested for
    this.passwordResetTokenExpire = Date.now() + (10 * 60 * 1000);
    // We are going to send the actual un-encrypted token to the user's mail
    // So that later it can be compared to what was saved in the db
    return passwordResetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
