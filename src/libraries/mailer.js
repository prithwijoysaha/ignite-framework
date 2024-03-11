import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

class Email {
	constructor(options) {
		this.transporter = nodemailer.createTransport({
			host: options.host,
			port: options.port,
			secure: options.secure,
			auth: {
				user: options.user,
				pass: options.pass,
			},
		});
	}

	async send(options) {
		// Compile the email template
		const template = handlebars.compile(options.template);
		const html = template(options.context);

		// Create the email message
		const message = {
			from: options.from,
			to: options.to,
			cc: options.cc,
			bcc: options.bcc,
			subject: options.subject,
			html,
			attachments: options.attachments,
		};

		// Send the email
		const info = await this.transporter.sendMail(message);

		console.log('Message sent: %s', info.messageId);
	}
}

export default Email;

// Uses Example
/*
import Email from './email';

const email = new Email({
	host: 'smtp.example.com',
	port: 587,
	secure: false,
	user: 'user@example.com',
	pass: 'password',
});

const template = `
  <p>Hello, {{name}}!</p>
  <p>{{message}}</p>
`;

email.send({
	from: 'sender@example.com',
	to: 'recipient1@example.com, recipient2@example.com',
	cc: 'cc1@example.com, cc2@example.com',
	bcc: 'bcc1@example.com, bcc2@example.com',
	subject: 'Hello',
	template: template,
	context: {
		name: 'John',
		message: 'Welcome to the site!',
	},
	attachments: [
		{
			filename: 'image.png',
			path: 'path/to/image.png',
			cid: 'image@example.com',
		},
	],
});
 */
