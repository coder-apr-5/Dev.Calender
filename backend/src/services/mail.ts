import { createTransport } from "nodemailer";

const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: parseInt(process.env.SMTP_PORT!) == 465,
    auth: {
        type: "oauth2",
        user: process.env.SMTP_USER,
        refreshToken: process.env.SMTP_REFRESH_TOKEN,
        clientId: process.env.SMTP_CLI_ID,
        clientSecret: process.env.SMTP_CLI_SEC
    },
    requireTLS: true
})

export const sendRegMail = async (email, username) => transport.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "Registration Confirmation",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}
.content {
  margin-top: 20px;
}
.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
</head>
<body>
<div class="container">
<div class="header">
  <h1>Thank You for Registering, ${username}!</h1>
</div>
<div class="content">
  <p>Dear ${username},</p>
  <p>We're thrilled to have you on board. Thank you for registering with us!</p>
  <p>We hope you enjoy your experience. If you have any questions, feel free to reach out.</p>
</div>
<div class="footer">
  <p>&copy; ${new Date().getFullYear()} Dev.Calender. All rights reserved.</p>
</div>
</div>
</body>
</html>
`
}, (err, info) => {
  if (err) {
      console.error(err);
  }
  console.log(info.response);
})

export const sendLoginMail = async (email, username) => transport.sendMail({
  from: process.env.SMTP_USER,
  to: email,
  subject: "New login from your account",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}
.content {
  margin-top: 20px;
}
.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
</head>
<body>
<div class="container">
<div class="header">
  <h1>New login from ${username}!</h1>
</div>
<div class="content">
  <p>Dear ${username},</p>
  <p>This is an automated email to let you know that we have a new login from your account.</p>
  <p>If you think someone else accessed your account, please contact support.</p>
</div>
<div class="footer">
  <p>&copy; ${new Date().getFullYear()} Dev.Calender. All rights reserved.</p>
</div>
</div>
</body>
</html>
`
}, (err, info) => {
  if (err) {
      console.error(err);
  }
  console.log(info.response);
})

export default transport.sendMail