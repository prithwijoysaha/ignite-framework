import './config/environment.js'; // This should be the top most import
import express, { Router, json, urlencoded } from 'express';
import { resolve as pathResolve, dirname } from 'path';
import actuator from 'express-actuator';
import apiResponse from './middlewares/apiResponse.js';
import notFoundError from './middlewares/notFoundError.js';
import uuid from './middlewares/uuid.js';
import errorHandler from './middlewares/errorHandler.js';
import { loadDocumentationFiles } from './config/documentation.js';
import apiRequest from './middlewares/apiRequest.js';
import loadRouterFiles from './config/route.js';
import rateLimiter from './middlewares/rateLimiter.js';
import cors from './middlewares/cors.js';
import helmet from './middlewares/helmet.js';
import { getSystemVitals } from './libraries/utility.js';
import auth from './middlewares/auth.js';
import logger from './middlewares/logger.js';
// import compression from './middlewares/compression.js';

const moduleDirectory = pathResolve(dirname('./'), 'src/modules');
const publicDirectory = pathResolve(dirname('./'), 'public');
const viewDirectory = pathResolve(dirname('./'), 'src/views');
const { APP_NAME, npm_package_version: npmPackageVersion, NODE_ENV, BASE_PATH } = process.env;

const app = express();
app.use(uuid);
app.disable('x-powered-by');
app.use(apiResponse); // set after uuid middleware and above all api routes
app.use(json({ limit: '5mb' }));
app.use(urlencoded({ limit: '5mb', extended: false }));
app.use(logger);
app.use(rateLimiter);
app.use(helmet);
app.use(cors);
app.use(auth);
app.use(apiRequest); // set after apiResponse middleware and above all api routes
// app.use(compression);
app.use(BASE_PATH, express.static(publicDirectory));
app.use(actuator());
app.set('views', viewDirectory);
app.set('view engine', 'ejs');

await loadRouterFiles(moduleDirectory, 'router.js', app);
await loadDocumentationFiles(moduleDirectory, 'doc.js', app);

app.use(
	`${BASE_PATH}/`,
	Router().get('/', async (req, res) => {
		res.setHeader('X-Powered-By', APP_NAME.toUpperCase()).render('index', {
			appName: APP_NAME.toUpperCase(),
			npmPackageVersion,
			nodeEnv: NODE_ENV.toUpperCase(),
		});
	}),
	Router().get('/health-check', (req, res) => {
		res.setHeader('X-Powered-By', APP_NAME.toUpperCase()).send('OK');
	}),
	Router().get('/long-response', (req, res) =>
		setTimeout(() => res.setHeader('X-Powered-By', APP_NAME.toUpperCase()).send('Finally! OK'), 30000),
	),
	Router().get('/vitals', async (req, res) => {
		res.json(await getSystemVitals());
	}),
);

app.use(notFoundError); // catch 404 and forward to error handler
app.use(errorHandler); // error handler this should be last middleware

export default app;
