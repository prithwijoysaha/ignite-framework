#!/usr/bin/env node
/* eslint-disable no-restricted-syntax */
import * as fs from 'node:fs';
import axios from 'axios';

const { NODE_ENV, KMS_URL, KMS_USER_ID, KMS_PROJECT_ID } = process.env;

const convertToEnv = (object) => {
	let envFile = '';
	for (const key of Object.keys(object)) {
		envFile += `${key}=${object[key]}\n`;
	}
	return envFile;
};

const updateEnvFile = (object) => {
	const { filename, fileContent } = object;
	return fs.writeFileSync(filename, convertToEnv(fileContent), (err) => {
		if (err) {
			throw err;
		}
		return true;
	});
};
const loadRunTimeEnv = () => {
	const kmsSupportedEnvironments = ['development', 'testing', 'staging', 'production'];
	if (kmsSupportedEnvironments.includes(NODE_ENV) && KMS_URL && KMS_USER_ID && KMS_PROJECT_ID) {
		return (
			axios({
				method: 'post',
				url: KMS_URL,
				timeout: 4000, // 4 seconds timeout
				data: {
					projectId: KMS_PROJECT_ID,
					userId: KMS_USER_ID,
				},
			})
				.then((response) => {
					const newEnvJson = JSON.parse(response);
					updateEnvFile({ fileName: `.env.${NODE_ENV}`, fileContent: newEnvJson });
				})
				// eslint-disable-next-line no-console
				.catch((error) => console.error(error))
		);
	}
	return true;
};

loadRunTimeEnv();
