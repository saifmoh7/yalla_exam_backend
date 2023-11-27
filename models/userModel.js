const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        userName: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        role: {type: String, require: true, default: "notAdmin"},
        approval: {type: String, require: true, default: "notApproval"},
        verified: {type: String, require: true, default: "notverified"},
        your_Scores: {type: Array, require: true, default: []},
        accountType: {type: String, require: true, default: "standard"},
        verifiyNumber: {type: Number,require: true},
        verificationAttempts: {type: Number,require: true, default: 0},
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('Users', userSchema)

module.exports = User;