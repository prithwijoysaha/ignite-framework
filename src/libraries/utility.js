import fs from 'fs';
import os from 'os';
import path from 'path';
import osUtils from 'os-utils';

export const getBoolean = (value) => {
	switch (value) {
		case true:
		case 'true':
		case 1:
		case '1':
		case 'on':
		case 'yes':
			return true;
		default:
			return false;
	}
};
export const isJSON = (data) => {
	try {
		if (typeof str === 'undefined' || typeof data !== 'string') {
			return false;
		}
		const parsed = JSON.parse(data);
		return parsed !== null;
	} catch (error) {
		return false;
	}
};
export const trimExtraSpace = (stringValue) => `${stringValue}`.replace(/\s+/g, ' ').trim();

export const safeToString = (x) => {
	switch (typeof x) {
		case 'object':
			return 'object';
		case 'function':
			return 'function';
		default:
			return `${x}`.replace(/\s+/g, ' ').trim();
	}
};

export const safeStringLowerCase = (value) => {
	if (typeof value === 'string') {
		return `${value}`.replace(/\s+/g, ' ').trim().toLowerCase();
	}
	if (typeof value === 'object' || typeof value === 'function') {
		return `${typeof value}`.replace(/\s+/g, ' ').trim();
	}
	return value;
};

export const safeString = (value) => {
	if (typeof value === 'string') {
		return `${value}`.replace(/\s+/g, ' ').trim();
	}
	if (typeof value === 'object' || typeof value === 'function') {
		return `${typeof value}`.replace(/\s+/g, ' ').trim();
	}
	return value;
};

export const prepareObject = (value) => {
	if (typeof value === 'object') {
		const data = Object.entries(value).reduce((accumulator, [key, element]) => {
			if (typeof element === 'string') {
				const preparedString = `${element}`.replace(/\s+/g, ' ').trim().toLowerCase();
				if (preparedString === '' || preparedString === 'null') {
					accumulator[key] = null;
					return accumulator;
				}
				if (preparedString === 'true') {
					accumulator[key] = true;
					return accumulator;
				}
				if (preparedString === 'false') {
					accumulator[key] = false;
					return accumulator;
				}
				if (preparedString === 'undefined') {
					accumulator[key] = undefined;
					return accumulator;
				}
				if (!Number.isNaN(Number(preparedString))) {
					accumulator[key] = Number(preparedString);
					return accumulator;
				}
				accumulator[key] = preparedString;
				return accumulator;
			}
			if (typeof element === 'object' && !Array.isArray(element)) {
				accumulator[key] = prepareObject(element);
				return accumulator;
			}
			if (Array.isArray(element)) {
				accumulator[key] = element.map((el) => prepareObject(el));
				return accumulator;
			}
			if (typeof element === 'function') {
				accumulator[key] = `${typeof element}`.replace(/\s+/g, ' ').trim();
				return accumulator;
			}
			accumulator[key] = element;
			return accumulator;
		}, {});
		return data;
	}
	return value;
};

export const streamToString = (stream) => {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', (err) => reject(err));
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	});
};

export const objectClone = (obj) => JSON.parse(JSON.stringify(obj));

export const isObjectEmpty = (data) => {
	if (typeof data !== 'object') {
		throw new Error('isObjectEmpty only takes objects as argument');
	}
	if (data && Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) {
		return true;
	}
	return false;
};

export const isObjectNotEmpty = (data) => {
	if (typeof data !== 'object') {
		throw new Error('isObjectNotEmpty only takes objects as argument');
	}
	if (Object.keys(data).length === 0 && Object.getPrototypeOf(data) === Object.prototype) {
		return false;
	}
	return true;
};

export const findFilesByExtension = (dir, extension, fileList = []) => {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const fileStat = fs.statSync(filePath);

		if (fileStat.isDirectory()) {
			findFilesByExtension(filePath, extension, fileList);
		} else if (file.endsWith(`.${extension}`)) {
			fileList.push(filePath);
		}
	});

	return fileList;
};

export const getSystemVitals = async () => {
	const formatBytes = (bytes) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};
	const getCpuUsage = () =>
		new Promise((resolve, reject) => {
			osUtils.cpuUsage((cpuUsage) => {
				if (cpuUsage === -1) {
					// If CPU usage retrieval fails, reject the Promise
					reject(new Error('Failed to get CPU usage.'));
				} else {
					// Otherwise, resolve the Promise with the CPU usage value
					resolve(`${(cpuUsage * 100).toFixed(2)} %`);
				}
			});
		});
	// Convert bytes to gigabytes
	const bytesToGB = (bytes) => `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;

	// Function to get CPU information
	const getCpuInfo = () => {
		const cpus = os.cpus();
		const cpuCount = cpus.length;
		const { model, speed } = cpus[0];
		const arch = os.arch();
		const totalMemory = os.totalmem();
		const freeMemory = os.freemem();
		const usedMemory = totalMemory - freeMemory;

		return {
			cpuCount,
			model,
			speed: `${speed} MHz`,
			arch,
			totalMemory: bytesToGB(totalMemory),
			freeMemory: bytesToGB(freeMemory),
			usedMemory: bytesToGB(usedMemory),
		};
	};

	const formatUptime = (seconds) => {
		const days = Math.floor(seconds / (3600 * 24));
		const hours = Math.floor((seconds % (3600 * 24)) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secondsRemainder = seconds % 60;

		let uptimeString = '';

		if (days > 0) {
			uptimeString += `${days} day${days > 1 ? 's' : ''}, `;
		}

		if (hours > 0) {
			uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
		}

		if (minutes > 0) {
			uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
		}

		uptimeString += `${secondsRemainder} second${secondsRemainder !== 1 ? 's' : ''}`;

		return uptimeString;
	};
	const totalMemory = os.totalmem();
	const freeMemory = os.freemem();
	const usedMemory = totalMemory - freeMemory;
	const memoryUsagePercentage = `${((usedMemory / totalMemory) * 100).toFixed(2)} %`;

	const memoryUsage = process.memoryUsage();
	const memoryInMB = {
		rss: formatBytes(memoryUsage.rss),
		heapTotal: formatBytes(memoryUsage.heapTotal),
		heapUsed: formatBytes(memoryUsage.heapUsed),
		external: formatBytes(memoryUsage.external),
		arrayBuffers: formatBytes(memoryUsage.arrayBuffers),
	};
	const uptimeInSeconds = os.uptime();
	const uptimeFormatted = formatUptime(uptimeInSeconds);
	return {
		cpu: { cpuUsages: await getCpuUsage(), cpuInfo: getCpuInfo() },
		memory: { memoryUsagePercentage, memoryInMB },
		uptime: uptimeFormatted,
	};
};

export const compareUrlsIgnoringParameters = (
	{ requestedUrlMethod, requestedUrl },
	{ definedRouteUrlMethod, definedRouteUrl }
) => {
	const compareArraysIgnoringColonPrefix = ({ requestedUrlArr, definedRouteUrlArr }) => {
		const modifiedArr2 = definedRouteUrlArr.map((item, index) =>
			item.startsWith(':') ? requestedUrlArr[index] : item
		);

		return JSON.stringify(requestedUrlArr) === JSON.stringify(modifiedArr2);
	};

	const parts1 = requestedUrl.replace(/\/+$/, '').split('/'); // Remove trailing slashes from URL1
	const parts2 = definedRouteUrl.replace(/\/+$/, '').split('/'); // Remove trailing slashes from URL2

	if (parts1.length !== parts2.length) {
		return false;
	}
	if (
		compareArraysIgnoringColonPrefix({ requestedUrlArr: parts1, definedRouteUrlArr: parts2 }) &&
		requestedUrlMethod === definedRouteUrlMethod
	) {
		return true;
	}
	return false;
};
