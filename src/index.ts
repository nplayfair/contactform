/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
import nodemailer from 'nodemailer';
import multiparty from 'multiparty';
import emailConfig from './email.config';

const app = express();
const PORT = process.env.PORT || 8000;

// Transporter
const transporter = nodemailer.createTransport({
  service: 'SendinBlue',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.key,
  },
});

// Interfaces
interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface Email {
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Routes
app.get('/', (req, res) => res.send('Access denied'));

app.post('/send', (req, res) => {
  const form = new multiparty.Form();
  const data: EmailData = {
    name: '',
    email: '',
    message: '',
  };
  form.parse(req, (err, fields: EmailData) => {
    if (err) {
      res.status(500).send(`Error: ${err}`);
    }
    data.name = fields.name.toString();
    data.email = fields.email.toString();
    data.message = fields.message.toString();

    const mail: Email = {
      from: data.email,
      to: emailConfig.email,
      subject: 'Contact form message from NP Electronics',
      text: `${data.name} <${data.email}> \n${data.message}`,
    };

    // Send email
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        res.status(500).send(`Error sending email: ${err}`);
      } else {
        res.status(200).send(`Email sent to ${info.accepted}`);
      }
    });
  });
});

// Server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on ${PORT}`);
});
