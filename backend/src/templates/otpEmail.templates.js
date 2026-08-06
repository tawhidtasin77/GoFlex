import { sendEmail } from "../utils/sendEmail.js";

const otpEmail = async(user) => {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Welcome to GoFlex 🎉</h2>
    
            <p>Hello <strong>${user.name}</strong>,</p>
    
            <p>Thank you for registering with GoFlex.</p>
    
            <p>Your verification code is:</p>
    
            <div style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                background: #f5f5f5;
                padding: 15px;
                text-align: center;
                border-radius: 8px;
            ">
                ${user.otp}
            </div>
    
            <p>This code will expire in <strong>10 minutes</strong>.</p>
    
            <p>If you didn't register, simply ignore this email.</p>
    
            <br>
    
            <p>Regards,<br><strong>GoFlex Team</strong></p>
        </div>
        `;

    try {
        await sendEmail(user.email, "GoFlex Registration OTP", html);
        console.log("OTP send successfully")
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
}

export { otpEmail };