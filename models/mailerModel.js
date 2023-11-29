const nodemailer = require("nodemailer");

const sendMailer = async (userEmail, htmlTemp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saif.2017.moh@gmail.com",
        pass: "ddep wydi rwpt fmgj",
      },
    });

    const mailOptions = {
      from: "saif.2017.moh@gmail.com",
      to: userEmail,
      subject: "Verify Email",
      html: htmlTemp
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(info)
    if (typeof info === 'object' && typeof info.messageId === 'string') {
      return {status:"ok", data:info}
    }else{
      return {status:"bad request", error: info}
    }
  } catch (error) {
    return {status:"error", error}
  }
}
// sendMailer('laithmohammedsaker@gmail.com',"test hello world").then(log=>console.log(log))
module.exports = sendMailer



// // 8UrL=8[r=8xf