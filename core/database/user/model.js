const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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
            validator: function (el) {
                return el === this.password
            },
        }
    },
    setPasswordAt: {
        type: Date,
        default: new Date()
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordTokenExpired: Date
})

// validate input between two processes adding from form and saving to database
userSchema.pre('save', async function (next) {
    // if password don't modify, go next middleware
    if (!this.isModified('password')) return next();

    // Hash password with const is 12
    this.password = await bcrypt.hash(this.password, 12)

    // Remove confirm password to save in database
    this.confirmPassword = undefined

    this.setPasswordAt = Date.now() - 1000;
    next()
})

/**
 * Check password hashed in database and password from request
 * */
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema)