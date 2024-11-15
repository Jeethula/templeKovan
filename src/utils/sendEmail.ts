import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'venkateshramkumar3@gmail.com',
    pass: 'kizz qqao hkap fofr'
  }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const msg = {
    from: 'venkateshramkumar.g2021csec@sce.ac.in',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error('Failed to send email');
  }
};