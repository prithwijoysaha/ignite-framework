import joi from 'joi';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
// check header and methods here
export default async (req, res, next) => {
	try {
		if (allowedMethods.includes(req.method)) {
			if (req.originalUrl.includes('api')) {
				const schema = joi.object({
					'x-no-compression': joi.string().optional(),
					'x-access-token': joi.string().optional(),
					'x-refresh-token': joi.string().optional(),
					'x-api-key': joi.string().optional(),
					'x-app-version': joi.string().optional(),
					'x-api-version': joi.string().optional(),
					'x-ip-v4': joi.string().optional(),
					'x-language': joi.string().valid('en').optional(),
					'x-time-zone': joi
						.string()
						.regex(/^(?:[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$/)
						.optional(), // example : +05:30
					'x-timestamp': joi.date().timestamp().optional(),
				});

				await schema.validateAsync({
					'x-no-compression': req.headers['x-no-compression'],
					'x-access-token': req.headers['x-access'],
					'x-refresh-token': req.headers['x-refresh-token'],
					'x-api-key': req.headers['x-api-key'],
					'x-app-version': req.headers['x-app-version'],
					'x-api-version': req.headers['x-api-version'],
					'x-ip-v4': req.headers['x-ip-v4'],
					'x-language': req.headers['x-language'],
					'x-time-zone': req.headers['x-time-zone'],
					'x-timestamp': req.headers['x-timestamp'],
				});
			}
			next();
		} else {
			res.return({ MethodNotAllowed: [{ reason: 'Requested method is not allowed' }] });
		}
	} catch (e) {
		res.return({
			BadRequest: [{ message: 'Invalid request headers', reason: e.details[0].message || e.message }],
		});
	}
};
