import chalk from 'chalk';
import './environment.js';

const {
	NODE_ENV,
	DEBUG,
	SQL_DB0_DIALECT,
	SQL_DB0_DATABASE,
	SQL_DB0_USERNAME,
	SQL_DB0_PASSWORD,
	SQL_DB0_HOST,
	SQL_DB0_PORT,
	SQL_RO_0_DB0_HOST,
	SQL_RO_0_DB0_USERNAME,
	SQL_RO_0_DB0_PASSWORD,
	APP_NAME,
	NOSQL_DB0_URI,
	MEMORY_DB0_HOST,
	MEMORY_DB0_PORT,
	MEMORY_DB0_PASSWORD,
	MEMORY_DB0_DATABASE,
	MEMORY_DB1_HOST,
	MEMORY_DB1_PORT,
	MEMORY_DB1_PASSWORD,
	MEMORY_DB1_DATABASE,
} = process.env;
const databaseLogger = (msg) => {
	if (DEBUG === 'true') {
		// eslint-disable-next-line no-console
		return console.log(
			`${chalk.black.bgWhiteBright.bold(msg[0].split(':')[0])} : ${chalk.green(
				msg[0].substring(msg[0].indexOf(':') + 1),
			)}`,
			'\n',
		); // Print query string
	}
	return false;
};
const commonConfig = {
	sql: {
		db0: {
			database: SQL_DB0_DATABASE,
			username: null,
			password: null,
			options: {
				/* host: SQL_DB0_HOST, */
				port: SQL_DB0_PORT,
				dialect: SQL_DB0_DIALECT,
				dialectOptions: {
					requestTimeout: 3000,
					// Your pg options here
					application_name: APP_NAME,
					/* ssl: {
						rejectUnauthorized: false,
						ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
						key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
						cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
					  }, */
					//   client_encoding: Incomplete check sequalize doc
				},
				// eslint-disable-next-line no-console
				logging: (...msg) => databaseLogger(msg),
				// Choose one of the logging options
				// logging: console.log,                  // Default, displays the first parameter of the log function call
				// logging: (...msg) => console.log(msg), // Displays all log function call parameters
				// logging: false,                        // Disables logging
				// logging: msg => logger.debug(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
				// logging: logger.debug.bind(logger)     // Alternative way to use custom logger, displays all messages
				migrationStorageTableName: 'sequelize_meta',
				migrationStorageTableSchema: 'private',
				replication: {
					read: [
						{ host: SQL_RO_0_DB0_HOST, username: SQL_RO_0_DB0_USERNAME, password: SQL_RO_0_DB0_PASSWORD },
						/* { host: '9.9.9.9', username: 'read-2-username', password: process.env.READ_DB_2_PW }, */
					],
					write: { host: SQL_DB0_HOST, username: SQL_DB0_USERNAME, password: SQL_DB0_PASSWORD },
				},
				pool: {
					max: 2,
					min: 0,
					acquire: 3000,
					idle: 100,
					evict: 300,
				},
			},
		},
	},
	nosql: {
		db0: {
			uri: NOSQL_DB0_URI,
			options: {
				autoIndex: false,
				maxPoolSize: 10,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMS: 45000,
				family: 4, // Use IPv4, skip trying IPv6
			},
		},
	},
	memory: {
		db0: {
			port: MEMORY_DB0_PORT, // Redis port
			host: MEMORY_DB0_HOST, // Redis host
			family: 4, // 4 (IPv4) or 6 (IPv6)
			password: MEMORY_DB0_PASSWORD,
			db: MEMORY_DB0_DATABASE,
		},
		db1: {
			port: MEMORY_DB1_PORT, // Redis port
			host: MEMORY_DB1_HOST, // Redis host
			family: 4, // 4 (IPv4) or 6 (IPv6)
			password: MEMORY_DB1_PASSWORD,
			db: MEMORY_DB1_DATABASE,
		},
	},
};

if (NODE_ENV === 'local') {
	commonConfig.sql.db0.options.pool = {
		max: 10,
		min: 0,
		acquire: 3000,
		idle: 100,
		evict: 300,
	};
	commonConfig.sql.db0.options.dialectOptions = {
		requestTimeout: 3000,
		// Your pg options here
		application_name: APP_NAME,
		/* ssl: {
				rejectUnauthorized: false,
				ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
				key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
				cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
			  }, */
		//   client_encoding: Incomplete check sequalize doc
	};
}

if (NODE_ENV === 'development') {
	commonConfig.sql.db0.options.pool = {
		max: 2,
		min: 0,
		acquire: 3000,
		idle: 100,
		evict: 300,
	};
	commonConfig.sql.db0.options.dialectOptions = {
		requestTimeout: 3000,
		// Your pg options here
		application_name: APP_NAME,
		/* ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
			key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
			cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
		  }, */
		//   client_encoding: Incomplete check sequalize doc
	};
}

if (NODE_ENV === 'testing') {
	commonConfig.sql.db0.options.pool = {
		max: 2,
		min: 0,
		acquire: 3000,
		idle: 100,
		evict: 300,
	};
	commonConfig.sql.db0.options.dialectOptions = {
		requestTimeout: 3000,
		// Your pg options here
		application_name: APP_NAME,
		/* ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
			key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
			cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
		  }, */
		//   client_encoding: Incomplete check sequalize doc
	};
}

if (NODE_ENV === 'staging') {
	commonConfig.sql.db0.options.pool = {
		max: 2,
		min: 0,
		acquire: 3000,
		idle: 100,
		evict: 300,
	};
	commonConfig.sql.db0.options.dialectOptions = {
		requestTimeout: 3000,
		// Your pg options here
		application_name: APP_NAME,
		/* ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
			key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
			cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
		  }, */
		//   client_encoding: Incomplete check sequalize doc
	};
}

if (NODE_ENV === 'production') {
	commonConfig.sql.db0.options.pool = {
		max: 2,
		min: 0,
		acquire: 3000,
		idle: 100,
		evict: 300,
	};
	commonConfig.sql.db0.options.dialectOptions = {
		requestTimeout: 3000,
		// Your pg options here
		application_name: APP_NAME,
		/* ssl: {
			rejectUnauthorized: false,
			ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString(),
			key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
			cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
		  }, */
		//   client_encoding: Incomplete check sequalize doc
	};
}

export default commonConfig;
