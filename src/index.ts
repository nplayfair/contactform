/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import emailConfig from './email.config';

const app = express();
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 8000;

// Transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.smtp,
  port: 587,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.key,
  },
});

// Routes
app.get('/', (req, res: express.Response) => res.send('Access denied'));
app.get('/send', (req, res: express.Response) => res.send('Access denied'));

app.post(
  '/send',
  body('name').exists({ checkNull: true }),
  body('email').isEmail(),
  body('message').isLength({ min: 5 }),
  (req: express.Request, res: express.Response) => {
    // Find validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Construct email to send
    interface Email {
      from: string;
      to: string;
      subject: string;
      text: string;
    }
    const mail: Email = {
      from: req.body.email,
      to: emailConfig.email,
      subject: 'Contact form message from NP Electronics',
      text: `${req.body.name} <${req.body.email}> \n${req.body.message}`,
    };

    // Send email
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        res.status(500).json(`Error sending email: ${err}`);
      }
      return res.status(200).send(`Sent to ${info.accepted}`);
    });

    return res.status(200);
  },
);

// Server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on ${PORT}`);
});
