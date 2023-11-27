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

    const info = transporter.sendMail(mailOptions)
    console.log("email send" + info.response)
  } catch (error) {
    
  }
}

module.exports = sendMailer



// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   //
//   // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
//   //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
//   //       <https://github.com/forwardemail/preview-email>
//   //
// }

// main().catch(console.error);

// module.exports = transporter;

// // 8UrL=8[r=8xf