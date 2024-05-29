// @ts-check
import ip from 'ip';
// import zlib from 'zlib';
// import util from 'util';

import logger from '../libraries/logger.js';
import { NO_LOG_ROUTES, SENSITIVE_KEYS } from '../config/constant.js';

// const unzip = util.promisify(zlib.unzip);
const hideSensitiveData = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map(hideSensitiveData);
	}
	const sensitiveKeys = SENSITIVE_KEYS;
	return Object.keys(obj).reduce((newObj, key) => {
		const newObject = newObj;
		if (sensitiveKeys.includes(key)) {
			newObject[key] = '*****';
		} else {
			newObject[key] = hideSensitiveData(obj[key]);
		}
		return newObject;
	}, {});
};

export default (req, res, next) => {
	const logExcludedRoutes = NO_LOG_ROUTES.map(({ url, methods }) => {
		if (url === '/') {
			return { url, methods: new Set(methods) };
		}
		return { url: url.replace(/\/$/, ''), methods: new Set(methods) };
	});
	const matches = logExcludedRoutes.map(
		(value) =>
			(req.path === value.url || req.path.replace(/\/$/, '') === value.url) && value.methods.has(req.method),
	);
	if (matches.some((value) => value)) {
		return next();
	}

	logger.info({
		[req.locals.requestId]: {
			request: {
				requestId: req.locals.requestId,
				headers: req.rawHeaders,
				protocol: req.protocol,
				host: req.get('host'),
				url: req.originalUrl,
				method: req.method,
				params: req.params,
				body: hideSensitiveData(req.body),
				query: req.query,
				ip: ip.address(),
			},
		},
	});
	const { write: oldWrite, end: oldEnd } = res;

	const chunks = [];

	res.write = async (chunk) => {
		chunks.push(chunk);
		oldWrite.call(res, chunk);
	};

	res.end = async (chunk) => {
		if (chunk) {
			chunks.push(chunk);
		}
		let responseBody;
		try {
			// if compression used then here have to de-compressed here
			responseBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
			/* responseBody = JSON.parse(
				(
					await unzip(Buffer.concat(chunks), {
						chunkSize: 16 * 1024,
						windowBits: zlib.constants.Z_DEFAULT_WINDOWBITS,
						memLevel: 8,
						level: zlib.constants.Z_BEST_SPEED,
					})
				).toString('utf8')
			); */
		} catch (e) {
			// if compression used then here have to de-compressed here
			responseBody = Buffer.concat(chunks).toString('utf8');
			/* responseBody = (
				await unzip(Buffer.concat(chunks), {
					chunkSize: 16 * 1024,
					windowBits: zlib.constants.Z_DEFAULT_WINDOWBITS,
					memLevel: 8,
					level: zlib.constants.Z_BEST_SPEED,
				})
			).toString('utf8'); */
		}
		logger.info({
			[req.locals.requestId]: {
				response: {
					body: responseBody,
					statusCode: res.statusCode,
				},
			},
		});

		oldEnd.call(res, chunk);
	};
	return next();
};
