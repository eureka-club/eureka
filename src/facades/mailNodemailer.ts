import nodemailer from 'nodemailer'


export const send = async ()=>{
  debugger;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER, // generated ethereal user
      pass: process.env.EMAIL_SERVER_PASS, // generated ethereal password
    },
  });
  
    const mailOptions = {
      from: 'hola@eureka.club',
      to: 'gbanoaol@gmail.com',
      subject: 'Invoices due',
      text: 'Dudes, we really need your money.'
    };
    
    return transporter.sendMail(mailOptions);

}
