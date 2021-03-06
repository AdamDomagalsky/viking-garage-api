import * as nodemailer from 'nodemailer';
import {
  contactRequest,
  contactMessage,
  signupMessage,
  resetMessage,
  rideMessage,
} from './templates';

const rideAddress = process.env.GMAIL_RIDE_USER;
const contactAddress = process.env.GMAIL_CONTACT_USER;

const transporterRide = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: parseInt(process.env.GMAIL_PORT, 10),
  secure: process.env.GMAIL_SECURE === 'true',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_RIDE_USER,
    clientId: process.env.GMAIL_RIDE_CLIENT_ID,
    clientSecret: process.env.GMAIL_RIDE_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_RIDE_REFRESH_TOKEN,
  },
});

const transporterContact = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: parseInt(process.env.GMAIL_PORT, 10),
  secure: process.env.GMAIL_SECURE === 'true',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_CONTACT_USER,
    clientId: process.env.GMAIL_CONTACT_CLIENT_ID,
    clientSecret: process.env.GMAIL_CONTACT_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_CONTACT_REFRESH_TOKEN,
  },
});

function sendEmail(body: any, type: string): Promise<any> {
  if (process.env.NODE_ENV === 'test') return Promise.resolve();
  switch (type) {
    case 'ride':
      return new Promise((res, rej) => {
        transporterRide.sendMail(body, (err, info) => {
          if (err) return rej(`Email sent error ${err}`);
          return res(`Email sent successfully ${info}`);
        });
      });
    default:
      return new Promise((res, rej) => {
        transporterContact.sendMail(body, (err, info) => {
          if (err) return rej(`Email sent error ${err}`);
          return res(`Email sent successfully ${info}`);
        });
      });
  }
}

function signupEmail(name: string, email: string, token: string, code: string): Promise<any> {
  const body = {
    from: contactAddress,
    to: email,
    ...signupMessage(name, token, code),
  };
  return sendEmail(body, 'contact');
}

function resetEmail(name: string, email: string, token: string, code: string): Promise<any> {
  const body = {
    from: contactAddress,
    to: email,
    ...resetMessage(name, token, code),
  };
  return sendEmail(body, 'contact');
}

function contactEmail(data: any): Promise<any> {
  const {
    name,
    email,
    type,
    body,
    message,
    code,
  } = data;
  if (type === 'ride') {
    const contactRequestBody = {
      from: rideAddress,
      to: rideAddress,
      ...contactRequest(name, email, type, message, body),
    };
    const rideBody = {
      from: rideAddress,
      to: email,
      ...rideMessage(name, code),
    };
    return Promise.all([
      sendEmail(rideBody, 'ride'),
      sendEmail(contactRequestBody, 'ride'),
    ]);
  }
  const contactBody = {
    from: contactAddress,
    to: email,
    ...contactMessage(name, code),
  };
  const contactRequestBody = {
    from: contactAddress,
    to: contactAddress,
    ...contactMessage(name, code),
  };
  return Promise.all([
    sendEmail(contactBody, 'contact'),
    sendEmail(contactRequestBody, 'contact'),
  ]);
}

export {
  signupEmail,
  resetEmail,
  contactEmail,
}
