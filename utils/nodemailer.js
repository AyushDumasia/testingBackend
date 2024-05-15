import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

export const getMail = async (mail, subject, message) => {
    await transporter.sendMail({
        from: '<adumasia1@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
    })
}
