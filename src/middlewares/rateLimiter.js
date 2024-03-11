import limiter from '../libraries/rateLimiter.js';

const exemptIpList = ['127.0.0.1', '::1'];

const rateLimiter = (req, res, next) => {
	if (exemptIpList.includes(req.ip)) {
		next();
	} else {
		limiter(req, res, next);
	}
};

export default rateLimiter;
