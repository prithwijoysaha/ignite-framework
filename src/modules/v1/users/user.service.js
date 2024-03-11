// @ts-check
import { v4 as uuidv4 } from 'uuid';
import { captureException } from '../../../libraries/exception.js';
import sqlDb0Models from '../../../databases/sql/db0/index.js';
import memoryDb0Models from '../../../databases/memory/db0/index.js';

const { Op, User } = sqlDb0Models;
const { AuthCache } = memoryDb0Models;

/**
 * @typedef {string} UUID - Universally Unique Identifier.
 * @typedef {object} BadRequest
 * @property {Array.<{message: string, reason:string}>} BadRequest - The status flag that defines operation has any data validation error or incorrect data provided.
 * @typedef {object} InternalServerError
 * @property {Array.<{message : string, reason:string }>} InternalServerError - The status flag that defines operation has a exception or unexpected error.
 * @typedef {object} Unauthorized
 * @property {Array.<{message : string, reason:string }>} Unauthorized - The status flag that defines operation has a authorization or authentication error.
 * @typedef {object} ServiceReturnType
 * @property {BadRequest|Unauthorized|InternalServerError|null} error - The key defines that any error occurred or not. (error:null => no-error occurred).
 * @property {object|Array|null} [data] - The output from the function.
 * @property {Function} [callback] - If any callback function needs to be return.
 */

/**
 * @async
 * @function findUserService
 * @param {string} startTimeStampTz -
 * @param {string} endTimeStampTz -
 * @param {Array} tags -
 * @param {number} offset -
 * @param {number} limit -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUserService = async (startTimeStampTz, endTimeStampTz, tags, offset, limit) => {
	try {
		let queryLimit = {};
		if (limit && limit > 0) {
			queryLimit = { ...queryLimit, limit };
		}
		if (offset && offset > 0) {
			queryLimit = { ...queryLimit, offset };
		}

		let whereStatement = {};
		if (startTimeStampTz && endTimeStampTz) {
			whereStatement = { createdAt: { [Op.between]: [startTimeStampTz, endTimeStampTz] } };
		}

		if (tags && tags.length > 0) {
			whereStatement = {
				...whereStatement,
				...{
					[Op.or]: tags.map((tag) => ({
						[Op.or]: {
							firstName: { [Op.like]: `%${tag}%` },
							lastName: { [Op.like]: `%${tag}%` },
							phone: { [Op.like]: `%${tag}%` },
							email: { [Op.like]: `%${tag}%` },
							organizationName: { [Op.like]: `%${tag}%` },
							organizationPhone: { [Op.like]: `%${tag}%` },
							organizationEmail: { [Op.like]: `%${tag}%` },
						},
					})),
				},
			};
		}

		const userDetails = await User.findAndCountAll({
			attributes: [
				['uuid', 'userId'],
				'firstName',
				'lastName',
				'phone',
				'email',
				'organizationName',
				'organizationPhone',
				'organizationEmail',
			],
			where: whereStatement,
			offset: queryLimit.offset,
			limit: queryLimit.limit,
			raw: true,
		});
		return { error: null, data: userDetails };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function findUserByIdService
 * @param {UUID} uuid -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const findUserByIdService = async (uuid) => {
	try {
		const userDetails = await User.findOne({
			attributes: [
				['uuid', 'userId'],
				'firstName',
				'lastName',
				'phone',
				'email',
				'organizationName',
				'organizationPhone',
				'organizationEmail',
			],
			where: {
				uuid,
			},
			raw: true,
		});
		if (userDetails === null) {
			return {
				error: { BadRequest: [{ message: 'No user details found.', reason: 'No user record found.' }] },
				data: null,
			};
		}
		return { error: null, data: userDetails };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function createUserService
 * @param {string} password - A password  digest
 * @param {string} salt - A password  digest
 * @param {object} preparedData -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const createUserService = async (password, salt, preparedData) => {
	try {
		const userDetails = await User.create({
			uuid: uuidv4(),
			password,
			salt,
			firstName: preparedData.firstName || null,
			lastName: preparedData.lastName || null,
			phone: `+${preparedData.phoneCountryCode} ${preparedData.phone}` || null,
			email: preparedData.email || null,
			organizationName: preparedData.organizationName || null,
			organizationPhone:
				`+${preparedData.organizationPhoneCountryCode} ${preparedData.organizationPhone}` || null,
			organizationEmail: preparedData.organizationEmail || null,
		});
		return { error: null, data: userDetails };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function updateUserService
 * @param {UUID} uuid - A unique id based on the update operation will perform
 * @param {object} preparedData -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const updateUserService = async (uuid, preparedData) => {
	try {
		let phone = null;
		if (preparedData.phoneCountryCode && preparedData.phone) {
			phone = `+${preparedData.phoneCountryCode} ${preparedData.phone}`;
		}
		let organizationPhone = null;
		if (preparedData.organizationPhoneCountryCode && preparedData.organizationPhone) {
			organizationPhone = `+${preparedData.organizationPhoneCountryCode} ${preparedData.organizationPhone}`;
		}
		const [effectedUserCount, effectedUserRecord] = await User.update(
			{
				firstName: preparedData.firstName || null,
				lastName: preparedData.lastName || null,
				phone,
				email: preparedData.email || null,
				organizationName: preparedData.organizationName || null,
				organizationPhone,
				organizationEmail: preparedData.organizationEmail || null,
			},
			{
				where: {
					uuid,
				},
				returning: true,
				raw: true,
			},
		);
		return {
			error: null,
			data: {
				count: effectedUserCount,
				records: effectedUserRecord.map((e) => ({
					userId: e.uuid,
					firstName: e.firstName,
					lastName: e.lastName,
					phone: e.phone,
					email: e.email,
					organizationName: e.organizationName,
					organizationPhone: e.organizationPhone,
					organizationEmail: e.organizationEmail,
				})),
			},
		};
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function patchUserService
 * @param {UUID} uuid - A unique id based on the update operation will perform
 * @param {string|undefined} password - A unique id based on the update operation will perform
 * @param {string|undefined} salt - A unique id based on the update operation will perform
 * @param {object} preparedData -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const patchUserService = async (uuid, password, salt, preparedData) => {
	try {
		let phone = null;
		if (preparedData.phoneCountryCode && preparedData.phone) {
			phone = `+${preparedData.phoneCountryCode} ${preparedData.phone}`;
		}
		let organizationPhone = null;
		if (preparedData.organizationPhoneCountryCode && preparedData.organizationPhone) {
			organizationPhone = `+${preparedData.organizationPhoneCountryCode} ${preparedData.organizationPhone}`;
		}
		const userDetails = await User.update(
			{
				firstName: preparedData.firstName,
				lastName: preparedData.lastName,
				phone: phone || undefined,
				email: preparedData.email,
				password,
				salt,
				organizationName: preparedData.organizationName,
				organizationPhone: organizationPhone || undefined,
				organizationEmail: preparedData.organizationEmail,
			},
			{
				where: {
					uuid,
				},
				returning: true,
				raw: true,
			},
		);

		if (password && userDetails[0] > 0) {
			await AuthCache.del(uuid);
		}
		return {
			error: null,
			data: {
				count: userDetails[0],
				records: userDetails[1].map((e) => ({
					userId: e.uuid,
					firstName: e.firstName,
					lastName: e.lastName,
					phone: e.phone,
					email: e.email,
					organizationName: e.organizationName,
					organizationPhone: e.organizationPhone,
					organizationEmail: e.organizationEmail,
				})),
			},
		};
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};

/**
 * @async
 * @function deleteUserService
 * @param {UUID} uuid -
 * @returns {Promise.<ServiceReturnType>} -
 * @throws {Error} If an uncaught or unhandled error occurs while doing the operation.
 */
export const deleteUserService = async (uuid) => {
	try {
		const rowDeletedCount = await User.destroy({
			where: {
				uuid,
			},
		});
		if (rowDeletedCount > 0) {
			await AuthCache.del(uuid);
		}

		return { error: null, data: rowDeletedCount };
	} catch (e) {
		captureException(e);
		return {
			error: { InternalServerError: [{ message: 'An unexpected error occurred.', reason: e.message }] },
			data: null,
		};
	}
};
