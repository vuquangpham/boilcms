const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {generateSHA256Token} = require("../../utils/token.utils");

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail]
    },
    password: {
        type: String,
        required: true,
        // Hide password from getting user
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            // this is only work on create and save
            validator: function (el) {
                return el === this.password
            },
        }
    },
    changePasswordAt: Date,
    registerAt: {
        default: () => Date.now(),
        type: Date
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordTokenExpired: Date,
    state: {
        type: String,
        enum: ['active', 'suspend'],
        default: 'active'
    },
});

// validate input between two processes adding from form and saving to database
User.pre('save', async function (next) {
    // if password don't modify, go next middleware
    if (!this.isModified('password')) return next();

    // Hash password with const is 12
    this.password = await bcrypt.hash(this.password, 12);

    // Remove confirm password to save in database
    this.confirmPassword = undefined;

    this.changePasswordAt = Date.now() - 1000;
    next();
});

/**
 * Compare password hashed in database and password from request
 * */
User.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check if the password changed after the token generated
 * @param JWTTimeStamp {Number}
 * @return boolean
 * */
User.methods.hasAlreadyChangedPassword = function (JWTTimeStamp) {
    if (this.changePasswordAt) {

        // JWTTimeStamp is the time when the token was created, and passwordChangedTime is the time when the password was last updated
        const passwordChangedTime = parseInt(this.changePasswordAt.getTime() / 1000, 10);
        return JWTTimeStamp < passwordChangedTime;
    }
    return false;
};

/**
 *
 * */
User.methods.createPasswordResetToken = function () {
    // create reset token
    const token = crypto.randomBytes(32).toString('hex');

    // hash reset token and save in database
    this.resetPasswordToken = generateSHA256Token(token);

    // create resetPasswordTokenExpired
    this.resetPasswordTokenExpired = Date.now() + 10 * 60 * 1000;

    return token;
};

module.exports = User;