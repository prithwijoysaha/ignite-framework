// @ts-check
import { captureException } from '../../../libraries/exception.js';

export const handleFailedTaskEventLambda = async ({ body: { eventName, eventData, returnError, returnData } }) => {
	try {
		// save failed event in database
		return { eventName, eventData, returnError, returnData };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred', reason: e.message }] },
			data: null,
		};
	}
};

export const handleSuccessTaskEventLambda = async ({ body: { eventName, eventData, returnError, returnData } }) => {
	try {
		// handle success event
		return { eventName, eventData, returnError, returnData };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred', reason: e.message }] },
			data: null,
		};
	}
};
