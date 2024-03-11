import { getBoolean } from '../libraries/utility.js';
import { DEFAULT_ERROR_MESSAGE } from '../config/constant.js';

const { DEBUG, APP_NAME } = process.env;

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	const errorStatus = err.status || 500;
	const actualErrorMessage = err.message;
	res.status(errorStatus);
	if (req.path.split('/')[1] === 'api') {
		return res.errorWithStatus(errorStatus, [{ reason: actualErrorMessage }]);
	}
	let errorMessage = DEFAULT_ERROR_MESSAGE;
	if (getBoolean(DEBUG)) {
		errorMessage = actualErrorMessage;
	}
	const errorDescription = err.stack;

	return res.render('error', { appName: APP_NAME.toUpperCase(), errorStatus, errorMessage, errorDescription });
};
export default errorHandler;
