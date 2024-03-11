import { v4 as uuidv4 } from 'uuid';
import { expressjwt as jwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import joi from 'joi';
import { NO_AUTH_ROUTES } from '../config/constant.js';
import sqlDb0Models from '../databases/sql/db0/index.js';
import memoryDb0Models from '../databases/memory/db0/index.js';
import Crypto from '../libraries/crypto.js';
import { captureException } from '../libraries/exception.js';

/**
 * @typedef {Array.<null|string,any>} ErrorFirstArray
 */

const { User } = sqlDb0Models;
const { AuthCache } = memoryDb0Models;
const { HOST, APP_NAME, AUTH_URI, AUTH_TYPE, HASH_ALGO } = process.env;
const bearer = () =>
	jwt({
		secret: expressJwtSecret({
			jwksUri: `${AUTH_URI}/.well-known/jwks.json`,
			requestHeaders: {}, // Optional
			timeout: 30000, // Defaults to 30s
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
		}),
		issuer: HOST,
		subject: APP_NAME,
		audience: HOST,
		algorithms: ['RS256'],
	}).unless({ path: NO_AUTH_ROUTES });

/**
 * @async
 * @function findUser
 * @param {uuidv4} uuid - User uuid to fetch credentials
 * @param {boolean} getCache - Get data from cache or not
 * @param {boolean} setCache - Set fetched data to cache or not
 * @returns {Promise.<ErrorFirstArray,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
 */
const findUser = async (uuid, getCache = true, setCache = true) => {
	let sqlQueryExecute = true;
	let userDetails;
	if (getCache) {
		sqlQueryExecute = false;
		const [cacheMiss, cachedData] = await AuthCache.get(uuid);
		userDetails = cachedData;
		if (cacheMiss !== null) {
			// no data found from cache, cache missed
			sqlQueryExecute = true;
		}
	}
	if (sqlQueryExecute) {
		userDetails = await User.findOne({
			attributes: ['id', 'uuid', 'password', 'salt'],
			where: {
				uuid,
			},
			raw: true,
		});
	}

	if (userDetails && sqlQueryExecute && setCache) {
		await AuthCache.setPxNx(uuid, userDetails);
	}

	if (userDetails === null) {
		return ['User details not found.', null];
	}
	return [null, userDetails];
};
const basic = async (req, res, next) => {
	try {
		const openRoutes = NO_AUTH_ROUTES.map(({ url, methods }) => {
			if (url === '/') {
				return { url, methods: new Set(methods) };
			}
			return { url: url.replace(/\/$/, ''), methods: new Set(methods) };
		});

		const matches = openRoutes.map(
			(value) =>
				(req.path === value.url || req.path.replace(/\/$/, '') === value.url) && value.methods.has(req.method)
		);
		if (matches.some((value) => value)) {
			return next();
		}

		// check for basic auth header
		if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
			return res.return({
				Unauthorized: [{ message: 'Missing authorization header.', reason: 'Missing authorization header.' }],
			});
		}
		// verify auth credentials
		const base64Credentials = req.headers.authorization.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
		const [username, password] = credentials.split(':');
		try {
			await joi
				.object({
					username: joi.string().uuid().required(),
					password: joi.string().required(),
				})
				.validateAsync({ username, password });
		} catch (e) {
			if (e.details) {
				return res.return({
					Unauthorized: e.details.map((errorDetail) => ({
						message: 'Invalid authentication credentials.',
						reason: errorDetail.message,
					})),
				});
			}
			throw e;
		}
		const [userDetailsError, userDetails] = await findUser(username, true, true);
		if (userDetailsError !== null) {
			return res.return({
				Unauthorized: [{ message: 'Invalid authentication credentials.', reason: userDetailsError }],
			});
		}

		if (Crypto.match(HASH_ALGO, password, userDetails.password, userDetails.salt)) {
			Object.assign(req, {
				locals: { ...req.locals, auth: { user: { id: userDetails.id, uuid: userDetails.uuid } } },
			});
			return next();
		}
		return res.return({
			Unauthorized: [
				{ message: 'Invalid authentication credentials.', reason: 'Invalid authentication credentials.' },
			],
		});
	} catch (e) {
		captureException(e);
		return res.return({ InternalServerError: [{ reason: e.message }] });
	}
};

const auth = (req, res, next) => {
	if (AUTH_TYPE && AUTH_TYPE === 'bearer') {
		return bearer(req, res, next);
	}
	if (AUTH_TYPE && AUTH_TYPE === 'basic') {
		return basic(req, res, next);
	}
	return next();
};

export default auth;
