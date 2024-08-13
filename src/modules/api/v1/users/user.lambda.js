import { captureException } from '../../../../libraries/exception.js';
import Email from '../../../../libraries/mailer.js';
import v1Bus from '../v1.bus.js';

const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

export const handleSendUserVerificationEmailLambda = async (event) => {
	const { error: returnError, data: returnData } = await (async () => {
		try {
			const { firstName, lastName, userUuid, email } = event.body;
			const emailObj = new Email({
				host: EMAIL_HOST,
				port: EMAIL_PORT,
				secure: EMAIL_SECURE,
				user: EMAIL_USERNAME,
				pass: EMAIL_PASSWORD,
			});

			const template = `
  			<p>Hello, {{name}}!</p>
  			<p>{{message}}</p>
		`;

			await emailObj.send({
				from: 'sender@example.com',
				to: email,
				subject: 'Hello',
				template,
				context: {
					name: `${firstName} ${lastName}`.trim(),
					message: `Welcome to the site! your user Id is : ${userUuid}`,
				},
			});
			return {
				OK: {
					message: 'SendUserVerificationEmailEvent successfully executed',
					data: {},
				},
			};
		} catch (e) {
			captureException(e);
			return {
				error: { InternalServerError: [{ message: 'An unexpected error occurred', reason: e.message }] },
				data: null,
			};
		}
	})();
	if (returnError !== null) {
		v1Bus.publish('FailedTaskEvent', {
			body: {
				eventName: 'SendUserVerificationEmailEvent',
				eventData: event,
				returnError,
				returnData,
			},
		});
	}
};

export default handleSendUserVerificationEmailLambda;
