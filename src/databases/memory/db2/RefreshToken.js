import { v4 as uuidv4 } from 'uuid';
/**
 * This is a Refresh token schema class.
 *
 * @class
 * @param {object} redis - The name of the example.
 */
export default class RefreshToken {
	constructor(redis) {
		this.redis = redis;
		this.keyPrefix = 'REFRESH-TOKEN';
		this.refreshTokenDefaultValidityInMillisecond = 1000 * 60 * 5; // 5 minutes;
	}

	/**
	 * @private
	 * @function refreshTokenKey
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @param {string} sessionId - A unique id based on the update operation will perform
	 * @returns {string} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	#refreshTokenKey = (userUuid, sessionId) => `${this.keyPrefix}-${userUuid}-${sessionId}`;

	/**
	 * @async
	 * @public
	 * @function get
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @param {string} sessionId - A unique id based on the update operation will perform
	 * @returns {Promise.<string|null,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	get = async (userUuid, sessionId) => {
		const key = this.#refreshTokenKey(userUuid, sessionId);
		const retrievedRefreshToken = await this.redis.get(key);
		return retrievedRefreshToken;
	};

	/**
	 * @async
	 * @public
	 * @function setPxNx
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @param {string} sessionId - A unique id based on the update operation will perform
	 * @param {string} refreshToken - A unique id based on the update operation will perform
	 * @param {number} expireAfter - A unique id based on the update operation will perform
	 * @returns {Promise.<string|null,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	setPxNx = async (
		userUuid,
		sessionId,
		refreshToken,
		expireAfter = this.refreshTokenDefaultValidityInMillisecond,
	) => {
		const key = this.#refreshTokenKey(userUuid, sessionId);
		const currentUnixTimestamp = Date.now();
		const timestampMilliseconds = currentUnixTimestamp + expireAfter;
		/*
			PXAT timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds.
			NX -- Only set the key if it does not already exist.
		*/
		const retrievedRefreshToken = await this.redis.set(key, `${refreshToken}`, 'PXAT', timestampMilliseconds, 'NX');
		return retrievedRefreshToken;
	};

	/**
	 * @async
	 * @public
	 * @function del
	 * @param {uuidv4} userUuid - A unique id based on the update operation will perform
	 * @param {string} sessionId - A unique id based on the update operation will perform
	 * @returns {Promise.<number,Error>} - A promise that returns a error first array if resolved, or an Error if rejected.
	 */
	del = async (userUuid, sessionId) => {
		const key = this.#refreshTokenKey(userUuid, sessionId);
		const noOfKeysDeleted = await this.redis.del(key);
		return noOfKeysDeleted;
	};
}
