import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

/**
 *
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
 */

export const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Task Manager',
            link: 'https://mailgen.js/',
        },
    });

    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    var emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: 'mail.taskmanager@example.com', // We can name this anything. The mail will go to your Mailtrap inbox
        to: options.email, // receiver's mail
        subject: options.subject, // mail subject
        text: emailText, // mailgen content textual variant
        html: emailHtml, // mailgen content html variant
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
        // So it's better to fail silently rather than breaking the app
        console.error(
            'Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file'
        );
        console.error('Error: ', error);
    }
};

/**
 *
 * @param {string} username
 * @param {string} verificationUrl
 * @returns {Mailgen.Content}
 * @description It designs the email verification mail
 */
export const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to App! We're very excited to have you on board.",
            action: {
                instructions: 'To get started with App, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Verify your email',
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

export const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: 'We got a request to reset your password',
            action: {
                instructions: 'To change your password click the button',
                button: {
                    color: '#22BC66',
                    text: 'reset button',
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

// Usage:-

// sendMail({
//     email: user.email,
//     subject: "aaa",
//     mailGenContent: emailVerificationMailGenContent(
//         username,
//         `url`
//     )
// })
