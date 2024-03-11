#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Module dependencies.
 */
import { createServer } from 'http';
import chalk from 'chalk';
import app from '../src/app.js';

const { blue, yellow, orange, red, magenta, bold, bgBlack } = chalk;
const { PORT, APP_NAME, NODE_ENV, npm_package_version: API_VERSION, PROTOCOL, HOST } = process.env;

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (Number.isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port  ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.log(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.log(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
	console.log(
		'\n',
		magenta(
			bgBlack(
				bold(
					` ${blue('ENVIRONMENT')} =>  ${yellow(NODE_ENV?.toUpperCase())}  ${blue('APP NAME')} => ${yellow(
						`${APP_NAME?.toUpperCase()} v${API_VERSION?.toUpperCase()}  ${blue('SERVER')} => ${yellow(
							`${server.address().address?.replace('::', '127.0.0.1')?.toUpperCase()}:${port}`
						)}  ${blue('URL')} => ${yellow(`${PROTOCOL}://${HOST}:${port}`)}`
					)} `
				)
			)
		),
		'\n'
	);
};

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const gracefulShutdownHandler = function gracefulShutdownHandler(signal) {
	console.log(orange(`⚠️ Caught ${signal}, gracefully shutting down`));
	setTimeout(() => {
		console.log(orange('🤞 Shutting down application'));
		// stop the server from accepting new connections
		server.close(() => {
			console.log(red('👋 All requests stopped, shutting down'));
			// once the server is not accepting connections, exit
			process.exit();
		});
	}, 0);
};

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on('SIGINT', gracefulShutdownHandler);

// The SIGTERM signal is sent to a process to request its termination.
process.on('SIGTERM', gracefulShutdownHandler);
