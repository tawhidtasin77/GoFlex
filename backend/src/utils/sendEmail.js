import nodemailer from "nodemailer"

const sendEmail = async (to, subject, html) => {
    try {
        // console.log("EMAIL_USER:", process.env.EMAIL_USER);
        // console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport(
            {
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            }
        );

        const mailOptions = {
            from: `"GoFlex" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        }

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log("Error sending mail: ", error);
    }
}

export { sendEmail };


