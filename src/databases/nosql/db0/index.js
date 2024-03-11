import { readdirSync } from 'fs';
import { basename as _basename, dirname, join } from 'path';
import mongoose from 'mongoose';
import { fileURLToPath, pathToFileURL } from 'url';
import database from '../../../config/database.js';
import { getBoolean } from '../../../libraries/utility.js';

const { Schema } = mongoose;
const { DEBUG } = process.env;
const config = database.nosql.db0;

const basename = _basename(fileURLToPath(import.meta.url));
mongoose.set('strictQuery', true);
mongoose.connect(config.uri, config.options);

if (getBoolean(DEBUG)) {
	mongoose.connection.on('connected', () => {
		// eslint-disable-next-line no-console
		console.log(`NOSQL mongoose DB0 connection has been established successfully.`);
	});

	// If the connection throws an error
	mongoose.connection.on('error', (err) => {
		// eslint-disable-next-line no-console
		console.log(`NOSQL mongoose DB0 connection error: ${err}`);
	});

	// When the connection is disconnected
	mongoose.connection.on('disconnected', () => {
		// eslint-disable-next-line no-console
		console.log('NOSQL mongoose DB0 connection disconnected');
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			// eslint-disable-next-line no-console
			console.log('NOSQL mongoose DB0 connection disconnected through app termination');
			process.exit(0);
		});
	});

	mongoose.connection.on('connected', () => {
		// eslint-disable-next-line no-console
		console.log('NOSQL DB0 connection has been established successfully.');
	});
	mongoose.connection.on('error', (error) => {
		// eslint-disable-next-line no-console
		console.log('NOSQL DB0 unable to connect to the database.', error);
	});
}

const db = {};
const modelDirectoryPath = dirname(fileURLToPath(import.meta.url));
const allModelFiles = readdirSync(modelDirectoryPath).filter(
	(file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
);

const models = await Promise.all(
	allModelFiles.map(async (file) => {
		const modelFile = join(modelDirectoryPath, file);
		const { default: model } = await import(pathToFileURL(modelFile));
		return model(mongoose.model, Schema, mongoose.Schema.Types);
	})
);

models.forEach((model) => {
	db[model.modelName] = model;
});

db.mongoose = mongoose;
db.Types = mongoose.Schema.Types;
export default db;
