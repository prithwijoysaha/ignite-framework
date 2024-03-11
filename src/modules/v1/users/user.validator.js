// @ts-check
import joi from 'joi';
import extend from '@joi/date';
import { captureException } from '../../../libraries/exception.js';

/**
 * @typedef {object} BadRequest
 * @property {Array.<{message: string, reason:string}>} BadRequest - The status flag that defines operation has any data validation error or incorrect data provided.
 * @typedef {object} InternalServerError
 * @property {Array.<{message : string, reason:string }>} InternalServerError - The status flag that defines operation has a exception or unexpected error.
 * @typedef {object} Unauthorized
 * @property {Array.<{message : string, reason:string }>} Unauthorized - The status flag that defines operation has a authorization or authentication error.
 * @typedef {object} ValidatorReturnType
 * @property {BadRequest|Unauthorized|InternalServerError|null} error - The key defines that any error occurred or not. (error:null => no-error occurred).
 * @property {object|Array|null} [data] - The output from the function.
 * @property {Function} [callback] - If any callback function needs to be return.
 */
const commonValidations = {
	userId: joi.string().uuid().required(),
	firstName: joi.string().max(100).trim(true),
	lastName: joi.string().max(100).trim(true),
	phoneCountryCode: joi.number().integer().min(1).max(1624),
	phone: joi
		.string()
		.pattern(/^[0-9]+$/)
		.min(4)
		.max(20)
		.trim(true),
	email: joi.string().email().max(60).trim(true),
	password: joi.string(),
	/* .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*(\S)\1)(?!.*è).{6,24}$/) */ organizationName: joi
		.string()
		.max(100)
		.trim(true),
	organizationPhoneCountryCode: joi.number().integer().min(1).max(1624),
	organizationPhone: joi
		.string()
		.pattern(/^[0-9]+$/)
		.min(4)
		.max(20)
		.trim(true)
		.required(),
	organizationEmail: joi.string().email().max(60).trim(true),
};

/**
 * @async
 * @function findUserValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUserValidator = async (rawData) => {
	try {
		const schema = joi
			.object({
				tags: joi
					.string()
					.regex(/^[A-Za-z0-9_,-]+$/)
					.optional(),
				startTimeStampTz: joi.extend(extend).date().format('YYYY-MM-DDTHH:mm:ssZ'),
				endTimeStampTz: joi.extend(extend).date().format('YYYY-MM-DDTHH:mm:ssZ'),
				offset: joi.number().min(0).max(9999).default(0).optional(),
				limit: joi.number().min(1).max(10000).default(10000).optional(),
			})
			.when(
				joi
					.object({
						startTimeStampTz: joi.date().exist(),
						endTimeStampTz: joi.date().exist(),
					})
					.not(),
				{
					then: joi.forbidden(),
					otherwise: joi.required(),
				},
			);
		const filteredData = await schema.validateAsync(rawData);
		return {
			error: null,
			data: {
				tags: filteredData.tags,
				startTimeStampTz: filteredData.startTimeStampTz,
				endTimeStampTz: filteredData.endTimeStampTz,
				offset: filteredData.offset,
				limit: filteredData.limit,
			},
		};
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function findUserByIdValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUserByIdValidator = async (rawData) => {
	try {
		const schema = joi.object({
			userId: commonValidations.userId,
		});
		const filteredData = await schema.validateAsync(rawData);
		return { error: null, data: { userUuid: filteredData.userId } };
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function createUserValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const createUserValidator = async (rawData) => {
	try {
		const schema = joi.object({
			firstName: commonValidations.firstName.required(),
			lastName: commonValidations.lastName.required(),
			phoneCountryCode: commonValidations.phoneCountryCode.required(),
			phone: commonValidations.phone.required(),
			email: commonValidations.email.required(),
			password: commonValidations.password.required(),
			organizationName: commonValidations.organizationName.required(),
			organizationPhoneCountryCode: commonValidations.organizationPhoneCountryCode.required(),
			organizationPhone: commonValidations.organizationPhone.required(),
			organizationEmail: commonValidations.organizationEmail.required(),
		});
		const filteredData = await schema.validateAsync(rawData);
		return {
			error: null,
			data: {
				firstName: filteredData.firstName,
				lastName: filteredData.lastName,
				phoneCountryCode: filteredData.phoneCountryCode,
				phone: filteredData.phone,
				email: filteredData.email,
				password: filteredData.password,
				organizationName: filteredData.organizationName,
				organizationPhoneCountryCode: filteredData.organizationPhoneCountryCode,
				organizationPhone: filteredData.organizationPhone,
				organizationEmail: filteredData.organizationEmail,
			},
		};
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function updateUserValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const updateUserValidator = async (rawData) => {
	try {
		const schema = joi.object({
			userId: commonValidations.userId,
			firstName: commonValidations.firstName.required().allow('', null),
			lastName: commonValidations.lastName.required().allow('', null),
			phoneCountryCode: commonValidations.phoneCountryCode.required().allow('', null),
			phone: commonValidations.phone.required().allow('', null),
			email: commonValidations.email.required().allow('', null),
			organizationName: commonValidations.organizationName.required().allow('', null),
			organizationPhoneCountryCode: commonValidations.organizationPhoneCountryCode.required().allow('', null),
			organizationPhone: commonValidations.organizationPhone.required().allow('', null),
			organizationEmail: commonValidations.organizationEmail.required().allow('', null),
		});
		const filteredData = await schema.validateAsync(rawData);
		return {
			error: null,
			data: {
				userUuid: filteredData.userId,
				firstName: filteredData.firstName,
				lastName: filteredData.lastName,
				phoneCountryCode: filteredData.phoneCountryCode,
				phone: filteredData.phone,
				email: filteredData.email,
				organizationName: filteredData.organizationName,
				organizationPhoneCountryCode: filteredData.organizationPhoneCountryCode,
				organizationPhone: filteredData.organizationPhone,
				organizationEmail: filteredData.organizationEmail,
			},
		};
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function patchUserValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const patchUserValidator = async (rawData) => {
	try {
		const schema = joi.object({
			userId: commonValidations.userId,
			firstName: commonValidations.firstName.optional(),
			lastName: commonValidations.lastName.optional(),
			phoneCountryCode: commonValidations.phoneCountryCode.optional(),
			phone: commonValidations.phone.optional(),
			email: commonValidations.email.optional(),
			password: commonValidations.password.optional(),
			organizationName: commonValidations.organizationName.optional(),
			organizationPhoneCountryCode: commonValidations.organizationPhoneCountryCode.optional(),
			organizationPhone: commonValidations.organizationPhone.optional(),
			organizationEmail: commonValidations.organizationEmail.optional(),
		});
		const filteredData = await schema.validateAsync(rawData);
		return {
			error: null,
			data: {
				userUuid: filteredData.userId,
				firstName: filteredData.firstName,
				lastName: filteredData.lastName,
				phoneCountryCode: filteredData.phoneCountryCode,
				phone: filteredData.phone,
				email: filteredData.email,
				password: filteredData.password,
				organizationName: filteredData.organizationName,
				organizationPhoneCountryCode: filteredData.organizationPhoneCountryCode,
				organizationPhone: filteredData.organizationPhone,
				organizationEmail: filteredData.organizationEmail,
			},
		};
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function deleteUserValidator
 * @param {object}  rawData - Unfiltered data to be validate
 * @returns {Promise<ValidatorReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const deleteUserValidator = async (rawData) => {
	try {
		const schema = joi.object({
			userId: commonValidations.userId,
		});
		const filteredData = await schema.validateAsync(rawData);
		return { error: null, data: { userUuid: filteredData.userId } };
	} catch (e) {
		if (e.details) {
			return {
				error: { BadRequest: e.details.map((errorDetail) => ({ message: errorDetail.message })) },
				data: null,
			};
		}
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};
