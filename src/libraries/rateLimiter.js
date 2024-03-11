import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import ip from 'ip';
import redisDb1 from '../databases/memory/db1/index.js';

// allows up to 50 requests per minute from the same IP address
export default rateLimit({
	store: new RedisStore({
		sendCommand: (...args) => redisDb1.call(...args),
	}),
	windowMs: 60 * 1000, // 1 minute
	max: 50,
	keyGenerator: () => ip.address(),
	handler: (req, res) => {
		res.return({
			TooManyRequest: [
				{
					message: 'Too many requests, please try again later',
					reason: 'Too many requests from this IP, please try again later',
				},
			],
		});
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
