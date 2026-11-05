import 'server-only';
import nodemailer from 'nodemailer';

export async function sendEmail(opts: { email: string; subject: string; message: string; html?: string }) {
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `${process.env.FROM_NAME || 'FocusHub'} <${process.env.FROM_EMAIL}>`,
    to: opts.email,
    subject: opts.subject,
    text: opts.message,
    html: opts.html,
  });
}
