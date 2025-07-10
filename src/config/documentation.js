import swaggerUi from 'swagger-ui-express';
import { pathToFileURL } from 'url';
import { findFilesByExtension, getBoolean } from '../libraries/utility.js';
import { API_RESPONSE_CODES, DEFAULT_ERROR_MESSAGE } from './constant.js';

const { NODE_ENV, APP_NAME, HOST, PROTOCOL, PORT, DEBUG } = process.env;

export const docServe = swaggerUi.serveFiles;
export const docSetup = swaggerUi.setup;

let host = HOST;
if (NODE_ENV === 'local') {
	host = `${HOST}:${PORT}`;
}
const defaultErrorTypeObject = Object.entries(API_RESPONSE_CODES).filter(
	([, value]) => value.defaultMessage === DEFAULT_ERROR_MESSAGE,
);
const defaultErrorType = defaultErrorTypeObject[0][0];

export const docOption = {
	customCssUrl: ['/assets/css/apidoc.css'],
	customSiteTitle: `${APP_NAME} | ${NODE_ENV}`,
	customfavIcon: '/favicon.ico',
	explorer: true,
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
		title: APP_NAME,
		version: '1.0.0',
	},
	servers: [
		{
			url: `${PROTOCOL}://${host}${BASE_PATH || ""}/api/{version}`,
			variables: {
				version: {
					default: 'v1',
					enum: ['v1'],
					description: 'The version of the API to use.',
				},
			},
		},
	],
	components: {
		securitySchemes: {
			BearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
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
								type: 'string'
							},
						},
					},
					message: {
						type: 'string',
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
					data: {
						type: 'object',
					},
				},
				example: {
					"meta": { "requestId": "135e96ad-d53c-44af-bda9-e0848cab8447", "responseType": "InternalServerError" }, "message": "Unexpected error occurred.", "errors": [{ "message": "Unexpected error occurred.", "reason": "This is a example internal server error" }], "data": {}
				}
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
		}),
	);
	allDocConfig.paths = paths;
	allDocConfig.components.schemas = { ...allDocConfig.components.schemas, ...components.schemas };

	app.use('/api-docs', docServe(allDocConfig, docOption), docSetup(allDocConfig, docOption));
};
