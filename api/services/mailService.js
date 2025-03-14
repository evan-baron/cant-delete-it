const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD
	}
});

const getTemplate = (templateName, replacements = {}) => {
	const filePath = path.join(__dirname, '../services/emailTemplates', `${templateName}.html`);
	let template = fs.readFileSync(filePath, 'utf8');

	for (let key in replacements) {
		const regex = new RegExp(`{{${key}}}`, 'g');
		template = template.replace(regex, replacements[key]);
	}

	return template;
}

const sendContactForm = async (name, email, message) => {
	const htmlContent = getTemplate('contactForm', {
		name,
		email,
		message
	})

	const mailOptions = {
		from: process.env.EMAIL,
		to: process.env.PERSONAL_EMAIL,
		subject: `Contact Us Message From ${name}`,
		html: htmlContent
	}

	try {
		await transporter.sendMail(mailOptions);
		console.log('Contact Us message sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
}

const sendPasswordResetEmail = async (user, resetToken) => {
	const { email } = user;

	//UPDATE BELOW WHEN YOU ADD THAT PART IN
	const resetLink = `https://localhost:5173/reset-password?token=${resetToken}`;

	const htmlContent = getTemplate('passwordReset', {
		resetLink,
		token: resetToken,
		supportEmail: 'CantDeleteItTeam@gmail.com'
	})

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: 'Password Reset Requested',
		html: htmlContent
	}

	try {
		await transporter.sendMail(mailOptions);
		console.log('Password reset email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

const sendVerificationEmail = async (user, verificationToken) => {
	const { email } = user;

	//UPDATE BELOW WHEN YOU ADD THAT PART IN
	const verifyLink = `https://localhost:5173/?token=${verificationToken}`;

	const htmlContent = getTemplate('emailVerification', {
		verifyLink,
		token: verificationToken,
		supportEmail: 'CantDeleteItTeam@gmail.com'
	})

	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: 'Email Verification',
		html: htmlContent
	}

	try {
		await transporter.sendMail(mailOptions);
		console.log('Verification email sent successfully');
	} catch (err) {
		console.error('Error sending email: ', err);
	}
};

module.exports = { sendContactForm, sendPasswordResetEmail, sendVerificationEmail };