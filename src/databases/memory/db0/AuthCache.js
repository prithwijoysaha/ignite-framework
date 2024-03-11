import { v4 as uuidv4 } from 'uuid';
import { isJSON } from '../../../libraries/utility.js';
/**
 * @typedef {Array.<null|string,any>} ErrorFirstArray
 */

/**
 * This is a User cache class.
 *
 * @class
 * @param {object} redis - The name of the example.
 */
export default class AuthCache {
	constructor(redis) {
		this.redis = redis;
		this.keyPrefix = 'AUTH-CACHE';
		this.authCacheDefaultValidityInMillisecond = 1000 * 60 * 60 * 24 * 7; // 7days
	}

	/**
	 * @private
	 * @function authCacheKey
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @returns {string} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	#authCacheKey = (userUuid) => `${this.keyPrefix}-${userUuid}`;

	/**
	 * @async
	 * @public
	 * @function get
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @returns {Promise.<ErrorFirstArray,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	get = async (userUuid) => {
		const key = this.#authCacheKey(userUuid);
		const retrievedAuthCache = await this.redis.get(key);
		if (isJSON(retrievedAuthCache)) {
			return [null, JSON.parse(retrievedAuthCache)];
		}
		return ['Cache Miss', null];
	};

	/**
	 * @async
	 * @public
	 * @function setPxNx
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @param {object} userData - A unique id based on the update operation will perform
	 * @param {number} expireAfter - A unique id based on the update operation will perform
	 * @returns {Promise.<ErrorFirstArray,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	setPxNx = async (userUuid, userData, expireAfter = this.authCacheDefaultValidityInMillisecond) => {
		const key = this.#authCacheKey(userUuid);
		const currentUnixTimestamp = Date.now();
		const timestampMilliseconds = currentUnixTimestamp + expireAfter;
		let dataToSet;
		if (isJSON) {
			dataToSet = JSON.stringify(userData);
		} else {
			dataToSet = `${userData}`;
		}
		/*
			PXAT timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds.
			NX -- Only set the key if it does not already exist.
		*/
		const result = await this.redis.set(key, dataToSet, 'PXAT', timestampMilliseconds, 'NX');
		return [null, result];
	};

	/**
	 * @async
	 * @public
	 * @function del
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @returns {Promise.<ErrorFirstArray,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	del = async (userUuid) => {
		const key = this.#authCacheKey(userUuid);
		const noOfKeysDeleted = await this.redis.del(key);
		return [null, noOfKeysDeleted];
	};
}
