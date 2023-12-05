const express = require("express")
const expressAsyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const sendMailer = require("../models/mailerModel");

const userRouter = express.Router();

// -------------- SIGN UP USER -------------------   

userRouter.post('/adduser', expressAsyncHandler(async (req, res) => {

    try {
        const userData = await User.find({"email": req.body.email})
        const userfound =  userData.find(({ email }) => email === req.body.email) || "";

        console.log("userData" + userData)
        console.log("userfound" + userfound)

        // if (req.body.email.match(/^([a-zA-Z0-9_\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/)) {
        //     res.json({message: "Invalid Email"})
        //     console.log("Invalid Email")
        // }
        // else
        // {
            if (userfound.email === req.body.email) {
                res.json({message: "this email is already existing"})
            } else {
                    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
                    const user = User({
                        userName: req.body.userName,
                        email: req.body.email,
                        password: req.body.password,
                        verifiyNumber: randomNumber
                    });
                
                    const createdUser = await user.save();
                    
                    sendMailer(req.body.email, `<p>${randomNumber}</p>`)

                    if (createdUser) {
                        res.json({
                            userData: {userName: createdUser.userName, email: createdUser.email},
                            // message: `"signup success, now verify your account by enter 6-digit we send it to ${req.body.email}"`
                            message: "verify now"
                        })
                    } else {console.log("signup fail")
                        res.json({message: "signup fail"})}
            }
        // }
    } catch (error) {
        console.log(error)
        res.json({message: "signup fail"})
    }
}))

// -------------- LOG IN USER ------------------- 

userRouter.post('/finduser', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.email})
        const user = userData.find(({ email }) => email === req.body.email);

        if (user.verified === "Verified") {
            if (user.email === req.body.email) {
                if ( user.password === req.body.password) {
                    const userData = {"userName": user.userName, "email": user.email, "role": user.role, "verified": user.verified, "accountType": user.accountType}
                    res.json({userData, message: "login success"})                    
                } else {
                    res.json({userData, message: "incorrect password"})
                }
            } else {
                res.json({message: "incorrect email"})
            }
        } else {
            res.json({message: "account not verified"})}
    } catch (error) {
        res.json({error, message: "incorrect email"})
    }
}))

// -------------- DELETE USER ------------------- 

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

// -------------- APPROE USER ------------------- 

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

// -------------- VERIFY ACCOUNT -------------------

userRouter.post('/verifyaccount', expressAsyncHandler(async (req, res) => {
    try {
        const userData = await User.find({"email": req.body.userEmail})
        const user = userData.find(({ email }) => email === req.body.userEmail);
        const verifiyNumber = parseInt(req.body.verifiyNumber)
        console.log(user.verifiyNumber)
        console.log(verifiyNumber)

        if (user.verifiyNumber === verifiyNumber) {
        
            const verifyUser = await User.findOneAndUpdate({"email" : req.body.userEmail}, {"verified" : "Verified"})
            console.log(verifyUser)
            if (verifyUser) {
                await User.updateOne({"email" : req.body.userEmail}, {$unset: { verifiyNumber: "", verificationAttempts: "" }})
                res.json({message: "email is verifing"})
            } else {
                res.json({message: "email is not verifing"})
            }
        }else {
            let verificationAttempts = user.verificationAttempts + 1
            await User.findOneAndUpdate({"email" : req.body.userEmail}, {"verificationAttempts" : verificationAttempts})
            if (user.verificationAttempts >= 4) {
                await User.findOneAndRemove({"email": req.body.userEmail})
                res.json({message: "fail sign up"})
            } else {
                res.json({message: "incorrect verify code"})  
            }
        }
    } catch (error) {
        res.json({status:403, error, message: "email not found"})
    }
}))

// -------------- ASSISTANT USER -------------------

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

        if (your_Scores) {
                res.json({status:200, message: "get scores success", your_Scores})
            
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