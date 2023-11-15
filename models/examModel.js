
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
        examApp: {type: String, require: true},
        examTitel: {type: String, require: true},
        examImageUrl: {type: String, require: true},
        examDes: {type: String, require: true},
        noQues: {type: Number, require: true, default: 0},
        questions: {type: Array, require: true, default: []},
        accountType: {type: String, require: true},
    },
    {
        timestamps: true,
    }
)

const Exam = mongoose.model('Exams', examSchema)

module.exports = Exam;