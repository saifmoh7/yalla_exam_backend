const express = require("express")
const expressAsyncHandler = require("express-async-handler");
const Exam = require("../models/examModel");

const examRouter = express.Router();

examRouter.get('/showexams', expressAsyncHandler(async (req, res) => {
    try {
        const exams = await Exam.find()

        if (Array.isArray(exams) && exams.every(exam=>typeof exam==='object')) {
            res.json({status:200, "exams": exams.map((exam) => 
            ({"_id": exam._id, "examApp": exam.examApp, "examTitel": exam.examTitel, "examImageUrl": exam.examImageUrl, "examDes": exam.examDes, "accountType": exam.accountType, 'noQues': exam.questions.length}))})
        }else {res.json({ status:404 })}
    } catch (error) {
        res.json({status:403, error})
    }
}))

examRouter.post('/addexam', expressAsyncHandler(async (req, res) => {

    try {
        const exam = Exam({
            examApp: req.body.examApp,
            examTitel: req.body.examTitel,
            examImageUrl: req.body.examImageUrl,
            examDes: req.body.examDes,
        });
    
        const createdExam = await exam.save();
    
        if (createdExam) {
            res.json({status:200,
                examId: createdExam._id,
                examApp: createdExam.examApp,
                examTitel: createdExam.examTitel,
                examImageUrl: createdExam.examImageUrl,
                examDes: createdExam.examDes,
                noQues: createdExam.noQues
            })
            console.log("is ok")
        } else {res.json({status: 404})}
    } catch (error) {
        res.json({status:403, error})
    }

}))

examRouter.post('/deletexam', expressAsyncHandler(async (req, res) => {
    try {
        const deleteExam = await Exam.findByIdAndRemove({"_id": req.body.examId})
        if (deleteExam) {
            res.json({ status:200, message: "exam was deleting" })
        } else {res.json({ status:404 })}
    } catch (error) {
        res.json({status:403, error})
    }
}))

examRouter.post('/showexam', expressAsyncHandler(async (req, res) => {
    try {
        const exam = await Exam.findById({"_id": req.body.examId})
        if (exam) {
            res.json({ status:200, "examId": exam._id, "examApp": exam.examApp, "examTitel": exam.examTitel, "examImageUrl": exam.examImageUrl, "examDes": exam.examDes, "noQues": exam.questions.length })
        } else {res.json({ status:404 })}
    } catch (error) {
        res.json({status:403, error})
    }
}))

examRouter.post('/updatexam', expressAsyncHandler(async (req, res) => {
    try {
        const updatExam = await Exam.updateMany({"_id": req.body.examId}, {"examApp": req.body.examApp, "examTitel": req.body.examTitel, "examImageUrl": req.body.examImageUrl, "examDes": req.body.examDes, "examApp": req.body.examApp,})
        if (updatExam) {
            res.json({ status:200, message: "exam was updating" })
        } else {res.json({ status:404 })}
    } catch (error) {
        res.json({status:403, error})
    }
}))


module.exports = examRouter;