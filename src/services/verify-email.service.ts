import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, token: string) {
  const url = `http://localhost:3000/auth/verify-email?token=${token}`;
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Verify your email",
      html: `<p>Click <a href="${url}"> here </a> to verify your email. </p>`,
    });
    console.log("Email sent: ", response);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
