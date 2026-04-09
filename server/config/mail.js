import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = async (receiverEmail, otp) => {
    const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0; width: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <tr>
                <td style="background-color: #000000; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">VIBE</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #1a1f23; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h2>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        We received a request to reset your password. Use the code below to complete the process. This code will expire in 5 minutes.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border: 2px dashed #1a1f23; border-radius: 12px; padding: 20px; display: inline-block;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #000000;">${otp}</span>
                    </div>

                    <p style="color: #888888; font-size: 14px; margin-top: 30px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                        &copy; 2026 Vibe Social Media. Built with passion in Sunamganj.
                    </p>
                </td>
            </tr>
        </table>
    </div>
    `;

    await transporter.sendMail({
        from: `"Vibe Support" <${process.env.EMAIL}>`,
        to: receiverEmail,
        subject: `${otp} is your Vibe reset code`,
        html: emailHtml
    });
};

export default sendMail;