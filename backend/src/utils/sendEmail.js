import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, subject, html) => {
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: "GoFlex",
                email: process.env.EMAIL_FROM,
            },
            to: [
                {
                    email: to,
                },
            ],
            subject,
            htmlContent: html,
        });

        console.log("Email sent successfully:", result.messageId);

        return result;
    } catch (error) {
        console.error(
            "Brevo email sending failed:",
            error?.message || error
        );

        throw error;
    }
};

export { sendEmail };