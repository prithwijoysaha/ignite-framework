import crypto from 'crypto';
/**
 * A class containing utility methods for performing cryptographic operations.
 */
export default class Crypto {
	/**
	 * Hashes the given data using the specified algorithm and an optional salt.
	 *
	 * @param {string} algorithm - The name of the hash algorithm to use.
	 * @param {string} dataToHash - The data to hash.
	 * @param {string} [salt] - An optional salt to add to the data before hashing.
	 * @returns {string} The hashed data as a hexadecimal string.
	 */
	static hash(algorithm, dataToHash, salt) {
		return crypto.pbkdf2Sync(dataToHash, salt, 1000, 64, algorithm).toString('hex');
	}

	/**
	 * Determines if the given data matches the given hash, using the specified algorithm and an optional salt.
	 *
	 * @param {string} algorithm - The name of the hash algorithm to use.
	 * @param {string} data - The data to check.
	 * @param {string} hashData - The expected hash.
	 * @param {string} [salt] - An optional salt that was used to create the hash.
	 * @returns {boolean} `true` if the data matches the hash, `false` otherwise.
	 */
	static match(algorithm, data, hashData, salt) {
		return Crypto.hash(algorithm, data, salt) === hashData;
	}

	static generateSalt() {
		return crypto.randomBytes(16).toString('hex');
	}

	static generateRSA256KeyPair(modulusLength = 1024) {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength,
			publicKeyEncoding: {
				type: 'spki',
				format: 'pem',
			},
			privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
			},
		});

		return { privateKey, publicKey };
	}

	static generateRandomPassword(length) {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_';
		let password = '';
		let i = 0;

		while (i < length) {
			const randomIndex = crypto.randomInt(0, charset.length);
			password += charset.charAt(randomIndex);
			i += 1;
		}

		return password;
	}

	static encrypt(text, passphrase, salt) {
		// Derive the encryption key and IV using the salt and passphrase
		const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 10000, 48, 'sha256');
		const encryptionKey = derivedKey.slice(0, 32); // 32 bytes for AES-256
		const iv = derivedKey.slice(32, 48); // 16 bytes for AES

		const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
		let encrypted = cipher.update(text, 'utf-8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	}

	static decrypt(encryptedText, passphrase, salt) {
		// Derive the encryption key and IV using the salt and passphrase
		const derivedKey = crypto.pbkdf2Sync(passphrase, salt, 10000, 48, 'sha256');
		const encryptionKey = derivedKey.slice(0, 32); // 32 bytes for AES-256
		const iv = derivedKey.slice(32, 48); // 16 bytes for AES

		const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
		let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}
}
