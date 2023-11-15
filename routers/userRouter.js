const express = require("express")
const expressAsyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const userRouter = express.Router();

userRouter.post('/adduser', expressAsyncHandler(async (req, res) => {

    try {
        const allUser = await User.find()
        const userData = await User.find({"email": req.body.email})
        const userfound = userData.find(({ email }) => email === req.body.email) || "";

        console.log(allUser)
        console.log(userData)
        console.log(userfound)
        console.log(allUser.length)

        if (req.body.email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
            res.json({message: "Invalid Email"})
            console.log("ok")
        }else{
            if (userfound.email === req.body.email) {
                res.json({message: "this email is already existing"})
            } else {
                if (allUser.length >=10 ) {
                    res.json({message: "the users found is too many"})
                } else {
                    const user = User({
                        userName: req.body.userName,
                        email: req.body.email,
                        password: req.body.password,
                    });
                
                    const createdUser = await user.save();
                
                    if (createdUser) {
                        res.json({
                            userData: {userName: createdUser.userName, email: createdUser.email},
                            message: "signup success"
                        })
                    } else {console.log("signup fail")
                        res.json({message: "signup fail"})}
                }
            }
        }
    } catch (error) {
        console.log("signupfail")
        res.json({message: "signup fail"})
    }
}))

userRouter.post('/finduser', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.email})
        const user = userData.find(({ email }) => email === req.body.email);

        if (user.email === req.body.email) {
            if (user.password === req.body.password) {
                if (user.approval === "Approval") {
                    const userData = {"userName": user.userName, "email": user.email, "role": user.role, "approval": user.approval, "accountType": user.accountType}
                    res.json({userData, message: "login success"})                    
                } else {
                    res.json({userData, message: "account not approval"})
                }
            } else {
                res.json({message: "incorrect password"})
            }
        } else {
            res.json({message: "incorrect email"})}
    } catch (error) {
        res.json({error, message: "incorrect email"})
    }
}))

userRouter.post('/deleteuser', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.adminEmail})
        const user = userData.find(({ email }) => email === req.body.adminEmail);

        if (user.password === req.body.adminPassword) {
            if (user.isAdmin === "Admin") {
                if (user.password === req.body.adminPassword) {
    
                        const deletedUser = await User.findOneAndRemove({"email": req.body.userEmail})
    
                        if (deletedUser) {
                            res.json({message: "email was deleting"})
                        } else {
                            res.json({message: "email not deleted"})
                        }
                } else {
                    res.json({message: "admin password is unvalied"})
                }
            } else {
                res.json({message: "the email not Admin"})}
        } else {
            res.json({message: "incorrect password"})
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

userRouter.post('/approveuser', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.adminEmail})
        const user = userData.find(({ email }) => email === req.body.adminEmail);

        if (user.password === req.body.adminPassword) {
            if (user.role === "Admin") {
                if (user.password === req.body.adminPassword) {
    
                        const approveUser = await User.findOneAndUpdate({"email" : req.body.userEmail}, {"approval" : "Approval"})
    
                        if (approveUser) {
                            res.json({message: "email was approving"})
                        } else {
                            res.json({message: "email not approved"})
                        }
                } else {
                    res.json({message: "admin password is unvalied"})
                }
            } else {
                res.json({message: "the email not Admin"})}
        } else {
            res.json({message: "incorrect password"})
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

userRouter.post('/assistantuser', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.adminEmail})
        const user = userData.find(({ email }) => email === req.body.adminEmail);

        if (user.password === req.body.adminPassword) {
            if (user.role === "Admin") {
                if (user.password === req.body.adminPassword) {
    
                        const approveUser = await User.findOneAndUpdate({"email" : req.body.userEmail}, {"role" : "Assistant"})
    
                        if (approveUser) {
                            res.json({message: "email was setting Assistant"})
                        } else {
                            res.json({message: "email not set Assistant"})
                        }
                } else {
                    res.json({message: "admin password is unvalied"})
                }
            } else {
                res.json({message: "the email not Admin"})}
        } else {
            res.json({message: "incorrect password"})
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

userRouter.get('/accounts', expressAsyncHandler(async (req, res) => {
    try {
        const accounts = await User.find({"accountsType": "accounts"})
        const accountType = accounts[0].accountType


        if (accountType) {
            res.json({status:200, accountType})
        }else {
            res.json({ status:404 })}
    } catch (error) {
        res.json({status:403, error})
    }
}))

userRouter.post('/addscores', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.email})
        const user = userData.find(({ email }) => email === req.body.email);
        const your_Scores = user.your_Scores
        console.log(your_Scores)

        if (your_Scores) {
            your_Scores.push(req.body.your_Scores)
            console.log(your_Scores)
            const updateScores = await User.findOneAndUpdate({"email" : req.body.email}, {"your_Scores" : your_Scores})
            // const scores = your_Scores
            if (updateScores) {
                res.json({status:200, message: "add scores success", your_Scores})
            } else {
                res.json({status:404, message: "scores dont update"})
            }
            
        } else {
            res.json({status:404, message: "scores not found"})
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

userRouter.post('/getscores', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.email})
        const user = userData.find(({ email }) => email === req.body.email);
        const your_Scores = user.your_Scores
        // console.log(your_Scores)

        if (your_Scores) {
            // your_Scores.push(req.body.your_Scores)
            // console.log(your_Scores)
            // const updateScores = await User.findOneAndUpdate({"email" : req.body.email}, {"your_Scores" : your_Scores})
            // // const scores = your_Scores
            // if (updateScores) {
                res.json({status:200, message: "get scores success", your_Scores})
            // } else {
            //     res.json({status:404, message: "scores dont update"})
            // }
            
        } else {
            res.json({status:404, message: "scores not found"})
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

userRouter.get('/version', expressAsyncHandler(async (req, res) => {
    try {
        const data = {
            version : "0.0.0", 
            appUrl : "https://play.google.com/store/apps/details?id=com.fyxtech.muslim"
        }
            res.json({status:200, data})
    } catch (error) {
        res.json({status:403, error})
    }
}))



module.exports = userRouter;