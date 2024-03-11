import { fileURLToPath, pathToFileURL } from 'url';
import { readdirSync } from 'fs';
import { dirname, join, basename as _basename } from 'path';
import chalk from 'chalk';
import { Sequelize, DataTypes, Op } from 'sequelize';
import database from '../../../config/database.js';
import { getBoolean } from '../../../libraries/utility.js';

const { DEBUG, NODE_ENV } = process.env;
const config = database.sql.db0;
const { green, red } = chalk;

const baseFilename = _basename(fileURLToPath(import.meta.url));
const sequelize = new Sequelize(config.database, config.username, config.password, config.options);

if (getBoolean(DEBUG)) {
	try {
		await sequelize.authenticate();
		console.log(`SQL DB0 => ${green('CONNECTED')} : Database Successfully Connected`);
	} catch (error) {
		console.log(`SQL DB0 => ${red('CONNECTION ERROR')} : `, error.message);
	}
}

const db = {};
const modelDirectoryPath = dirname(fileURLToPath(import.meta.url));
const allModelFiles = readdirSync(modelDirectoryPath).filter(
	(file) => file.indexOf('.') !== 0 && file !== baseFilename && file.slice(-3) === '.js',
);
const modelPromises = allModelFiles.map(async (file) => {
	const modelFile = join(modelDirectoryPath, file);
	const { default: model } = await import(pathToFileURL(modelFile));
	return model(sequelize, DataTypes);
});

const models = await Promise.all(modelPromises);
models.forEach((model) => {
	db[model.name] = model;
});
if (NODE_ENV === 'local') {
	sequelize.sync();
}

db.Op = Op;
db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
