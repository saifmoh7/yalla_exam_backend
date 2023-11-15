const express = require("express")
const expressAsyncHandler = require("express-async-handler");
const Exam = require("../models/examModel");

const questionRouter = express.Router();

questionRouter.post('/addquestion', expressAsyncHandler(async (req, res) => {
    try {
        const exam = await Exam.findOne({_id: req.body.examId})
        const question = {
            questionId: stringGenerator(16),
            question : req.body.question,
            quesImgURL: req.body.quesImgURL,
            options: req.body.options,
            correctOption: req.body.correctOption,
            ref: req.body.ref,
            allOfTheAbove: req.body.allOfTheAbove,
            trueOrfalse: req.body.trueOrfalse,
            quesImgURLState: req.body.quesImgURLState
        }
        exam.questions.push(question)
        exam.noQues = exam.questions.length
        const addQustion = await exam.save();
        res.json({status:200, addQustion})

    } catch (error) {
        console.log(error)
        res.json({status:403, error})
    }
}))

questionRouter.post('/showquestions', expressAsyncHandler(async (req, res) => {
    try {
        const exam = await Exam.findOne({"_id": req.body.examId})

        const questions = exam.questions
        if (questions) {
            res.json({status:200, questions})
        } else {res.json({status:404, message: "Exam Not Found"})}

    } catch (error) {
        res.json({status:403, error})
    }
}))

questionRouter.post('/showquestion', expressAsyncHandler(async (req, res) => {
    try {
        const exam = await Exam.findOne({"_id": req.body.examId})

        const question = exam.questions.find(question => question.questionId === req.body.questionId)
        if (question) {
            res.json({status:200, question})
        } else {res.json({status:404, message: "Question Not Found"})}

    } catch (error) {
        res.json({status:403, error})
    }
}))

questionRouter.post('/deletequestion', expressAsyncHandler(async (req, res) => {
    try {
        const deletQues = await Exam.updateOne({"_id": req.body.examId}, {$pull: {"questions": {"questionId": req.body.questionId}}})

        if (deletQues) {
            res.json({status:200, message: "Question is Deleting"})
        } else {res.json({status:403, message: "Exam Not Found"})}

    } catch (error) {
        res.json({status:403, error})
    }
}))

questionRouter.post('/updatequestion', expressAsyncHandler(async (req, res) => {
    try {
        const updateQues = await Exam.updateOne({"_id": req.body.examId, "questions.questionId": req.body.questionId}, {$set: {"questions.$.question": req.body.question, "questions.$.quesImgURL": req.body.quesImgURL, "questions.$.options": req.body.options, "questions.$.correctOption": req.body.options[0], "questions.$.ref": req.body.ref, "questions.$.allOfTheAbove": req.body.allOfTheAbove, "questions.$.trueOrfalse": req.body.trueOrfalse, "questions.$.quesImgURLState": req.body.quesImgURLState, }})
        console.log(req.body.questionId)
        if (updateQues) {
            res.json({status:200, message: "Question is Updating"})
            console.log("update")
        } else {res.json({status:403, message: "Exam Not Found"})}

    } catch (error) {
        res.json({status:403, error})
    }
}))

function stringGenerator(length=10,options={}){
    let { onlyNumbers } = options;
    let symboles = ['A','a','B','b','C','c','D','d','E','e','F','f','G','g','H','h','I','i','J','j','K','k','L','l','M','m','N','n','O',
                    'o','P','p','Q','q','R','r','S','s','T','t','U','u','V','v','W','w','X','x','Y','y','Z','z','0','1','2','3','4','5','6','7','8','9'];
    if( onlyNumbers === true ){
      symboles = ['0','1','2','3','4','5','6','7','8','9'];
    }
    let string = '';
    for (let i = 0; i < parseInt(length); i++) {
      let index = Math.floor(Math.random()*symboles.length);
      string+=symboles[index]
    }
    return string;
  }

module.exports = questionRouter;