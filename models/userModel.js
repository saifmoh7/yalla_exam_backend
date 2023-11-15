const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        userName: {type: String, require: true},
        email: {type: String, require: true},
        password: {type: String, require: true},
        role: {type: String, require: true, default: "notAdmin"},
        approval: {type: String, require: true, default: "notApproval"},
        your_Scores: {type: Array, require: true, default: []},
        accountType: {type: Object, require: true, default: {"accountType": "standard"}}
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('Users', userSchema)

module.exports = User;