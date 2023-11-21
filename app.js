const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")

const examRouter = require("./routers/examRouter")
const questionRouter = require("./routers/questionRouter");
const userRouter = require("./routers/userRouter")

const app = express();
const port = 5000;


mongoose.connect('mongodb+srv://saifmoh7:13241324@database.emmkw1l.mongodb.net/YallaExam?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
}).then(() => {
console.log('connected to mongoDB');
}).catch((error) => {
    console.log(error.reason);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.use('/exams', examRouter);
app.use('/questions', questionRouter);
app.use('/users', userRouter);


app.listen(process.env.PORT || port, () => {
    console.log(`Server at http://localhost:${port}`)
})