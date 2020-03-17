import { setApiKey, send } from '@sendgrid/mail';

setApiKey(process.env.SENGRID_KEY);

export default async (to, subject, text) => {
  try {
    const msg = {
      to,
      from: process.env.MAIL_ADRESS,
      subject,
      html: text
    };

    await send(msg);

    return true;
  } catch (err) {
    return false;
  }
};
