import path from 'path';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ENVIRONMENTS } from './constant.js';

const { DEBUG } = process.env;
const NODE_ENV = process.env.NODE_ENV || 'local';

if (ENVIRONMENTS.includes(NODE_ENV)) {
	const myEnv = config({ debug: DEBUG, path: path.resolve(`.env.${NODE_ENV}`) });
	expand(myEnv);
}

process.env.NODE_ENV = NODE_ENV;
