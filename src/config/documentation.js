import swaggerUi from 'swagger-ui-express';
import { pathToFileURL } from 'url';
import { findFilesByExtension, getBoolean } from '../libraries/utility.js';
import { API_RESPONSE_CODES, DEFAULT_ERROR_MESSAGE } from './constant.js';

const { NODE_ENV, APP_NAME, npm_package_version: npmPackageVersion, HOST, PROTOCOL, PORT, DEBUG } = process.env;

export const docServe = swaggerUi.serveFiles;
export const docSetup = swaggerUi.setup;

let host = HOST;
if (NODE_ENV === 'local') {
	host = `${HOST}:${PORT}`;
}
const defaultErrorTypeObject = Object.entries(API_RESPONSE_CODES).filter(
	([, value]) => value.defaultMessage === DEFAULT_ERROR_MESSAGE
);
const defaultErrorType = defaultErrorTypeObject[0][0];

export const docOption = {
	/* customJs: ['/custom.js'], */
	/* customCss: '.swagger-ui .topbar { display: none !important }; body{background:black !important;}', */
	customCssUrl: ['/assets/css/apidoc.css'],
	customSiteTitle: `${APP_NAME} | ${NODE_ENV}`,
	customfavIcon: '/favicon.ico',
	explorer: true,
	/*
	swaggerOptions: {
		validatorUrl: null,
		urls: [
			{
				url: 'http://petstore.swagger.io/v2/swagger.json',
				name: 'Spec1',
			},
			{
				url: 'http://petstore.swagger.io/v2/swagger.json',
				name: 'Spec2',
			},
		],
	}, */
};

let debugErrorProperty = {};
if (getBoolean(DEBUG)) {
	debugErrorProperty = {
		reason: {
			type: 'string',
		},
	};
}

export const docCommonConfig = {
	openapi: '3.0.0',
	info: {
		version: npmPackageVersion,
		title: APP_NAME,
		description: 'An express based nodejs api service',
		termsOfService: `/terms/`,
		contact: {
			name: 'Prithwijoy Saha',
		},
		license: {
			name: 'Apache 2.0',
			url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
		},
	},
	host,
	basePath: '/api',
	schemes: [PROTOCOL],
	servers: [
		{
			url: `${PROTOCOL}://${host}/api/{version}`,
			variables: {
				version: {
					default: 'v1',
					enum: ['v1'],
					description: 'The version of the API to use.',
				},
			},
		},
	],

	consumes: ['application/json'],
	produces: ['application/json'],
	components: {
		schemas: {
			Error: {
				type: 'object',
				required: ['meta', 'errors'],
				properties: {
					meta: {
						type: 'object',
						properties: {
							requestId: {
								type: 'string',
								format: 'uuid',
							},
							responseType: {
								type: 'string',
								name: defaultErrorType,
							},
						},
					},
					errors: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								message: {
									type: 'string',
								},
								...debugErrorProperty,
							},
						},
					},
					result: {
						type: 'object',
					},
				},
			},
		},
	},
};

export const loadDocumentationFiles = async (dir, extension, app) => {
	const docFiles = findFilesByExtension(dir, extension);
	const allDocConfig = docCommonConfig;
	const paths = {};
	const components = {};

	await Promise.all(
		docFiles.map(async (filePath) => {
			const { default: apiDocument } = await import(pathToFileURL(filePath));
			if (apiDocument && apiDocument.paths) {
				Object.assign(paths, apiDocument.paths);
			}
			if (apiDocument && apiDocument.components) {
				Object.assign(components, apiDocument.components);
			}
		})
	);
	allDocConfig.paths = paths;
	allDocConfig.components.schemas = { ...allDocConfig.components.schemas, ...components.schemas };

	app.use('/api-docs', docServe(allDocConfig, docOption), docSetup(allDocConfig, docOption));
};
