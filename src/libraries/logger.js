import fs from 'fs';
import winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment-timezone';

const { NODE_ENV, APP_NAME, LOG_SERVICE_URI } = process.env;

if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

const fileErrorTransport = new winston.transports.DailyRotateFile({
	filename: `logs/${APP_NAME}-${NODE_ENV}-error-%DATE%.log`,
	level: 'error',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
});

const fileCombinedTransport = new winston.transports.DailyRotateFile({
	filename: `logs/${APP_NAME}-${NODE_ENV}-combined-%DATE%.log`,
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d',
});

// Set up the HTTP transport
const httpTransport = new winston.transports.Http({
	host: LOG_SERVICE_URI,
	// port: 8000,
	path: '/log',
	// Use the daily rotating file transport as a stream when the HTTP transport fails
	stream: fileCombinedTransport,
	// Set the HTTP error transport as the error stream
	errorStream: fileErrorTransport,
});

const consoleTransport = new winston.transports.Console({
	format: winston.format.combine(winston.format.json()),
});

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(() => moment().utc().format('YYYY-MM-DD HH:mm:ss.ms Z')),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.json()
	),
	defaultMeta: { service: APP_NAME, environment: NODE_ENV },
	transports: [httpTransport, fileCombinedTransport, consoleTransport],
	exitOnError: false,
});

export default logger;
