import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

const generateMagicLinkHtml = (magicLink: string, minutesUntilExpiry: number) => `
<!DOCTYPE html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="background-color:#fefbea;font-family:'Poppins',sans-serif;margin:0;padding:32px 16px;">
    <div style="background:#fff;margin:0 auto;border-radius:16px;border:4px solid #00a884;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:480px;padding:32px 24px;">
      <!-- Content -->
      <h1 style="color:#333333;font-size:20px;font-weight:700;text-align:center;margin:0 0 8px 0;">Konfirmasi Masuk</h1>
      <p style="color:#666666;font-size:14px;text-align:center;margin:0 0 24px 0;">Klik tombol di bawah untuk masuk ke akun kamu:</p>
      
      <!-- Button -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${magicLink}" style="display:inline-block;background:#00a884;color:#fff;padding:14px 32px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 4px 12px rgba(0,168,132,0.3);">Lanjutkan Masuk</a>
      </div>
      
      <!-- Info -->
      <p style="color:#666666;font-size:12px;text-align:center;margin:24px 0 0 0;">Link ini akan kedaluwarsa dalam ${minutesUntilExpiry} menit demi keamanan Anda.</p>
      <p style="color:#666666;font-size:12px;text-align:center;margin:8px 0 0 0;font-style:italic;">Jika kamu tidak meminta ini, abaikan email ini.</p>
    </div>
  </body>
</html>
`;

export const magicLink = Email({
  id: "magic-link",
  apiKey: process.env.RESEND_API_KEY as string,
  maxAge: 10 * 60,
  async sendVerificationRequest({ identifier: email, expires, token, provider }) {
    const minutesUntilExpiry = Math.floor((+expires - Date.now()) / (60 * 1000));
    const link = `${process.env.SITE_URL}/link?token=${token}&email=${encodeURIComponent(email)}`;
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: "SAH-in Aja! <accounts@sahin.biz.id>",
      to: [email],
      subject: "Masuk ke SAH-in Aja!",
      html: generateMagicLinkHtml(link, minutesUntilExpiry),
    });

    if (error) {
      throw new Error(`Could not send email: ${error.message}`);
    }
  },
});
