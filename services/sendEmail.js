import nodemailer from "nodemailer";

//================================================
export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS
    },
  });

  const info = await transporter.sendMail({
    from: 'hi'+ process.env.EMAIL_ADDRESS,
    to: to ? to : "",
    subject: subject ? subject : " hi ",
    html: html ? html : "hello ",
  });
  //========================
  if (info.accepted.length) {
    return true;
  } else {
    return false;
  }
};
