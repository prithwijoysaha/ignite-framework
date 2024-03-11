import compression from 'compression';
import zlib from 'zlib';

export default compression({
	level: zlib.constants.Z_BEST_SPEED,
	threshold: 1,
	strategy: zlib.constants.Z_DEFAULT_STRATEGY,
	filter: (req, res) => {
		if (req.headers['x-no-compression']) {
			// don't compress responses with this request header
			return false;
		}

		// fallback to standard filter function
		return compression.filter(req, res);
	},
});
