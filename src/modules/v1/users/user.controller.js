// @ts-check
import { captureException } from '../../../libraries/exception.js';
import { prepareObject } from '../../../libraries/utility.js';
import {
	findUserByIdValidator,
	findUserValidator,
	createUserValidator,
	updateUserValidator,
	patchUserValidator,
	deleteUserValidator,
} from './user.validator.js';
import {
	findUserByIdService,
	findUserService,
	createUserService,
	updateUserService,
	patchUserService,
	deleteUserService,
} from './user.service.js';
import Crypto from '../../../libraries/crypto.js';
import { DEFAULT_HASH_ALGO } from '../../../config/constant.js';
import userBus from './user.bus.js';

/**
 * @typedef {string} UUID - Universally Unique Identifier.
 * @typedef {object} OK
 * @property {{message:string,data:{count:number,records:Array}}} OK - The status flag defines operation successful, message is the success message, count inside data object defines number of row effected or number of records fetched .
 * @typedef {object} BadRequest
 * @property {Array.<{message: string,reason:string}>} BadRequest - The status flag that defines operation has any data validation error or incorrect data provided.
 * @typedef {object} Unauthorized
 * @property {Array.<{message : string, reason:string }>} Unauthorized - The status flag that defines operation has a authorization or authentication error.
 * @typedef {object} InternalServerError
 * @property {Array.<{message : string, reason:string }>} InternalServerError - The status flag that defines operation has a exception or unexpected error.
 * @typedef {OK|BadRequest|Unauthorized|InternalServerError} ControllerReturnType
 */
const { HASH_ALGO } = process.env;

/**
 * Finds users based on specified criteria.
 *
 * @async
 * @function findUser
 * @param {object} request - The request object containing the payload.
 * @param {object} request.payload - The payload object.
 * @param {string} request.payload.startTimeStampTz - The start timestamp in timezone format.
 * @param {string} request.payload.endTimeStampTz - The end timestamp in timezone format.
 * @param {string} request.payload.tags - Optional. A comma-separated string of tags.
 * @param {number} request.payload.offset - The offset value for data fetching.
 * @param {number} request.payload.limit - The limit value for data fetching.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUser = async (request) => {
	try {
		const { payload } = request; //	The payload object.
		// Data validation
		const { error: validationError, data: validatedData } = await findUserValidator({
			startTimeStampTz: payload.startTimeStampTz,
			endTimeStampTz: payload.endTimeStampTz,
			tags: payload.tags,
			offset: payload.offset,
			limit: payload.limit,
		});
		if (validationError !== null) {
			return validationError;
		}

		// Data preparation and passing to the model
		const { error: findUserError, data: findUserResult } = await findUserService(
			validatedData.startTimeStampTz,
			validatedData.endTimeStampTz,
			validatedData.tags ? validatedData.tags.split(',') : undefined,
			validatedData.offset,
			validatedData.limit
		);
		if (findUserError !== null) {
			return findUserError;
		}
		return {
			OK: {
				message: findUserResult.length === 0 ? 'No record found.' : 'User data found.',
				data: {
					count: findUserResult.length,
					records: findUserResult,
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while fetching user records.', reason: e.message },
			],
		};
	}
};

/**
 * Finds a user by their ID.
 *
 * @async
 * @function findUserById
 * @param {object} request - The request object containing the payload.
 * @param {object} request.payload - The payload object containing the user ID.
 * @param {UUID} request.payload.userId - The ID of the user to find.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUserById = async (request) => {
	try {
		const { payload } = request;

		// Data validation
		const { error: validationError, data: validatedData } = await findUserByIdValidator({
			userId: payload.userId,
		});
		if (validationError !== null) {
			return validationError;
		}
		// Data preparation and passing to the model
		const { error: findUserByIdError, data: findUserByIdResult } = await findUserByIdService(
			validatedData.userUuid
		);
		if (findUserByIdError !== null) {
			return findUserByIdError;
		}

		return {
			OK: {
				message: 'User details found.',
				data: {
					count: 1,
					records: [findUserByIdResult],
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while fetching user details.', reason: e.message },
			],
		};
	}
};

/**
 * Creates a new user with the provided user details.
 *
 * @async
 * @function createUser
 * @param {object} request - The request object containing the payload.
 * @param {object} request.payload - The payload object containing user details.
 * @param {string} request.payload.firstName - The first name of the user.
 * @param {string} request.payload.lastName - The last name of the user.
 * @param {string} request.payload.phoneCountryCode - The country code of the user's phone number.
 * @param {string} request.payload.phone - The phone number of the user.
 * @param {string} request.payload.email - The email address of the user.
 * @param {string} request.payload.password - The password of the user.
 * @param {string} request.payload.organizationName - The name of the user's organization.
 * @param {string} request.payload.organizationPhoneCountryCode - The country code of the organization's phone number.
 * @param {string} request.payload.organizationPhone - The phone number of the organization.
 * @param {string} request.payload.organizationEmail - The email address of the organization.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const createUser = async (request) => {
	try {
		const { payload } = request;

		// Data validation
		const { error: validationError, data: validatedData } = await createUserValidator({
			firstName: payload.firstName,
			lastName: payload.lastName,
			phoneCountryCode: payload.phoneCountryCode,
			phone: payload.phone,
			email: payload.email,
			password: payload.password,
			organizationName: payload.organizationName,
			organizationPhoneCountryCode: payload.organizationPhoneCountryCode,
			organizationPhone: payload.organizationPhone,
			organizationEmail: payload.organizationEmail,
		});
		if (validationError !== null) {
			return validationError;
		}
		const salt = Crypto.generateSalt();
		// Data preparation and passing to the model
		const { error: createUserServiceError, data: createUserServiceResult } = await createUserService(
			Crypto.hash(HASH_ALGO || DEFAULT_HASH_ALGO, validatedData.password, salt),
			salt,
			prepareObject({
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				phoneCountryCode: validatedData.phoneCountryCode,
				phone: validatedData.phone,
				email: validatedData.email,
				organizationName: validatedData.organizationName,
				organizationPhoneCountryCode: validatedData.organizationPhoneCountryCode,
				organizationPhone: validatedData.organizationPhone,
				organizationEmail: validatedData.organizationEmail,
			})
		);
		if (createUserServiceError !== null) {
			return createUserServiceError;
		}
		userBus.publish('SendUserVerificationEmailEvent', {
			body: {
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				userUuid: createUserServiceResult.uuid,
				email: validatedData.email,
			},
		});
		return {
			OK: {
				message: 'User details saved successfully.',
				data: {
					count: 1,
					records: [
						{
							userId: createUserServiceResult.uuid,
							firstName: createUserServiceResult.firstName,
							lastName: createUserServiceResult.lastName,
							phone: createUserServiceResult.phone,
							email: createUserServiceResult.email,
							organizationName: createUserServiceResult.organizationName,
							organizationPhone: createUserServiceResult.organizationPhone,
							organizationEmail: createUserServiceResult.organizationEmail,
						},
					],
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while saving user details.', reason: e.message },
			],
		};
	}
};

/**
 * Updates complete user details based on the provided request payload.
 *
 * @async
 * @function updateUser
 * @param {object} request - The request object containing the payload.
 * @param {object} request.payload - The payload object containing the user ID with user details.
 * @param {UUID} request.payload.userId - The ID of the user to be updated.
 * @param {string} request.payload.firstName - The first name of the user.
 * @param {string} request.payload.lastName - The last name of the user.
 * @param {string} request.payload.phoneCountryCode - The country code of the user's phone number.
 * @param {string} request.payload.phone - The phone number of the user.
 * @param {string} request.payload.email - The email address of the user.
 * @param {string} request.payload.password - The password of the user.
 * @param {string} request.payload.organizationName - The name of the user's organization.
 * @param {string} request.payload.organizationPhoneCountryCode - The country code of the organization's phone number.
 * @param {string} request.payload.organizationPhone - The phone number of the organization.
 * @param {string} request.payload.organizationEmail - The email address of the organization.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const updateUser = async (request) => {
	try {
		const { payload } = request;
		// Data validation
		const { error: validationError, data: validatedData } = await updateUserValidator({
			userId: payload.userId,
			firstName: payload.firstName,
			lastName: payload.lastName,
			phoneCountryCode: payload.phoneCountryCode,
			phone: payload.phone,
			email: payload.email,
			organizationName: payload.organizationName,
			organizationPhoneCountryCode: payload.organizationPhoneCountryCode,
			organizationPhone: payload.organizationPhone,
			organizationEmail: payload.organizationEmail,
		});
		if (validationError !== null) {
			return validationError;
		}

		// Data preparation and passing to the model
		const { error: updateUserServiceError, data: updateUserServiceResult } = await updateUserService(
			validatedData.userUuid,
			prepareObject({
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				phoneCountryCode: validatedData.phoneCountryCode,
				phone: validatedData.phone,
				email: validatedData.email,
				organizationName: validatedData.organizationName,
				organizationPhoneCountryCode: validatedData.organizationPhoneCountryCode,
				organizationPhone: validatedData.organizationPhone,
				organizationEmail: validatedData.organizationEmail,
			})
		);
		if (updateUserServiceError !== null) {
			return updateUserServiceError;
		}
		return {
			OK: {
				message: 'User details updated successfully.',
				data: {
					count: updateUserServiceResult.count,
					records: updateUserServiceResult.records,
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while updating user details.', reason: e.message },
			],
		};
	}
};

/**
 * Updates user details partially based on the provided request.
 *
 * @async
 * @function patchUser
 * @param {object} request - The request object containing the payload.
 * @param {object} request.payload - The payload object containing the user ID with user details.
 * @param {UUID} request.payload.userId - The ID of the user to be update.
 * @param {string} [request.payload.firstName] - The first name of the user.
 * @param {string} [request.payload.lastName] - The last name of the user.
 * @param {string} [request.payload.phoneCountryCode] - The country code of the user's phone number.
 * @param {string} [request.payload.phone] - The phone number of the user.
 * @param {string} [request.payload.email] - The email address of the user.
 * @param {string} [request.payload.password] - The password of the user.
 * @param {string} [request.payload.organizationName] - The name of the user's organization.
 * @param {string} [request.payload.organizationPhoneCountryCode] - The country code of the organization's phone number.
 * @param {string} [request.payload.organizationPhone] - The phone number of the organization.
 * @param {string} [request.payload.organizationEmail] - The email address of the organization.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const patchUser = async (request) => {
	try {
		const { payload } = request;

		// Data validation
		const { error: validationError, data: validatedData } = await patchUserValidator({
			userId: payload.userId,
			firstName: payload.firstName,
			lastName: payload.lastName,
			phoneCountryCode: payload.phoneCountryCode,
			phone: payload.phone,
			email: payload.email,
			organizationName: payload.organizationName,
			organizationPhoneCountryCode: payload.organizationPhoneCountryCode,
			organizationPhone: payload.organizationPhone,
			organizationEmail: payload.organizationEmail,
		});
		if (validationError !== null) {
			return validationError;
		}
		// Generates a salt using `Crypto.generateSalt()` for password hashing.
		const salt = Crypto.generateSalt();
		// Data preparation and passing to the model
		const { error: patchUserServiceError, data: patchUserServiceResult } = await patchUserService(
			validatedData.userUuid,
			validatedData.password
				? Crypto.hash(HASH_ALGO || DEFAULT_HASH_ALGO, validatedData.password, salt)
				: undefined,
			validatedData.password ? salt : undefined,
			prepareObject({
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				phoneCountryCode: validatedData.phoneCountryCode,
				phone: validatedData.phone,
				email: validatedData.email,
				organizationName: validatedData.organizationName,
				organizationPhoneCountryCode: validatedData.organizationPhoneCountryCode,
				organizationPhone: validatedData.organizationPhone,
				organizationEmail: validatedData.organizationEmail,
			})
		);
		if (patchUserServiceError !== null) {
			return patchUserServiceError;
		}

		return {
			OK: {
				message: 'User details updated successfully.',
				data: {
					count: patchUserServiceResult.count,
					records: patchUserServiceResult.records,
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while updating user details.', reason: e.message },
			],
		};
	}
};

/**
 * Deletes user details based on the provided request.
 *
 * @async
 * @function deleteUser
 * @param {object} request - The request object containing payload information.
 * @param {object} request.payload - The payload object containing the user ID.
 * @param {UUID} request.payload.userId - The ID of the user to be deleted.
 * @returns {Promise<ControllerReturnType>} A promise that resolves to an object representing the result of the operation.
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const deleteUser = async (request) => {
	try {
		const { payload } = request;

		// Data validation
		const { error: validationError, data: validatedData } = await deleteUserValidator({ userId: payload.userId });
		if (validationError !== null) {
			return validationError;
		}

		// Data preparation and passing to the model
		const { error: deleteUserError, data: deleteUserResult } = await deleteUserService(validatedData.userUuid);
		if (deleteUserError !== null) {
			return deleteUserError;
		}

		return {
			OK: {
				message: deleteUserResult ? 'User details deleted successfully.' : 'User details not exist.',
				data: {
					count: deleteUserResult,
					records: [],
				},
			},
		};
	} catch (e) {
		captureException(e);
		return {
			InternalServerError: [
				{ message: 'Unexpected error occurred while deleting user details.', reason: e.message },
			],
		};
	}
};
