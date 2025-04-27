// helpers/emailService.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

const { UKR_NET_EMAIL, UKR_NET_PASSWORD, BASE_URL } = process.env;

if (!UKR_NET_EMAIL || !UKR_NET_PASSWORD) {
  throw new Error('Email or password not defined in environment variables');
}

const transport = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;

  const mailOptions = {
    from: UKR_NET_EMAIL,
    to: email,
    subject: 'Підтвердження реєстрації',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333333; text-align: center;">Ласкаво просимо!</h2>
          <p style="font-size: 16px; color: #666666;">
            Дякуємо за реєстрацію. Щоб завершити процес, будь ласка, підтвердіть свою електронну пошту, натиснувши на кнопку нижче:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Підтвердити Email
            </a>
          </div>
          <p style="font-size: 14px; color: #999999; text-align: center;">
            Якщо ви не реєструвались у нас, просто ігноруйте цей лист.
          </p>
        </div>
      </div>
    `,
  };

  await transport.sendMail(mailOptions);
};
