export default {
	paths: {
		'/users': {
			get: {
				description: 'Returns single or multiple user records from the system based on allowed query params',
				operationId: 'find-user-records',
				produces: ['application/json'],
				tags: ['User'],
				parameters: [
					{
						name: 'tags',
						in: 'query',
						description: 'tags to filter by',
						required: false,
						type: 'array',
						items: {
							type: 'string',
						},
						collectionFormat: 'csv',
					},
					{
						name: 'limit',
						in: 'query',
						description: 'maximum number of results to return',
						required: true,
						type: 'integer',
						format: 'int32',
					},
					{
						name: 'startTimeStampTz',
						in: 'query',
						description: 'timestamp with required zone',
						required: false,
						type: 'string',
						format: 'date-time',
					},
					{
						name: 'endTimeStampTz',
						in: 'query',
						description: 'timestamp with required zone',
						required: false,
						type: 'string',
						format: 'date-time',
					},
				],
				responses: {
					200: {
						description: 'user response',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/FetchMultipleSuccessResponse',
								},
							},
						},
					},
					default: {
						description: 'unexpected error',
						schema: {
							$ref: '#/components/schemas/Error',
						},
					},
				},
			},
			post: {
				description: 'Creates a new user in the store.  Duplicates are allowed',
				operationId: 'create-user',
				produces: ['application/json'],
				tags: ['User'],
				parameters: [
					{
						name: 'body',
						in: 'body',
						description: 'user to add to the store',
						required: true,
						schema: {
							type: 'object',
							$ref: '#/components/schemas/NewUserRequest',
						},
					},
				],
				responses: {
					200: {
						content: {
							'application/json': {
								$ref: '#/components/schemas/NewSuccessResponse',
							},
						},
					},
					default: {
						description: 'unexpected error',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/Error',
								},
							},
						},
					},
				},
			},
		},
		'/users/{userId}': {
			get: {
				description: 'Returns a user record based on a single userId',
				operationId: 'find-single-user',
				produces: ['application/json'],
				tags: ['User'],
				parameters: [
					{
						name: 'userId',
						in: 'path',
						description: 'userId of user to fetch',
						required: true,
						type: 'string',
						format: 'uuid',
					},
				],
				responses: {
					200: {
						description: 'user response',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/FetchSingleSuccessResponse',
								},
							},
						},
					},
					default: {
						description: 'unexpected error',
						schema: {
							$ref: '#/components/schemas/Error',
						},
					},
				},
			},
			put: {
				description: 'Update all field based on userId or if record not exist then create a new record',
				operationId: 'update-or-create-single-user',
				produces: ['application/json'],
				tags: ['User'],
				parameters: [
					{
						name: 'userId',
						in: 'path',
						description:
							'userId of user to update all field or if record not exist then create a new record',
						required: true,
						type: 'string',
						format: 'uuid',
					},
					{
						name: 'body',
						in: 'body',
						description: 'user to update to the store',
						required: true,
						schema: {
							type: 'object',
							$ref: '#/components/schemas/NewUserRequest',
						},
					},
				],
				responses: {
					200: {
						description: 'user response',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UpdateSuccessResponse',
								},
							},
						},
					},
					default: {
						description: 'unexpected error',
						schema: {
							$ref: '#/components/schemas/Error',
						},
					},
				},
			},
			patch: {
				description: 'Update specific field based on userId',
				operationId: 'update-single-user',
				produces: ['application/json'],
				tags: ['User'],
				parameters: [
					{
						name: 'userId',
						in: 'path',
						description: 'userId of user to update specific field',
						required: true,
						type: 'string',
						format: 'uuid',
					},
					{
						name: 'body',
						in: 'body',
						description: 'update individual field in the store',
						required: true,
						schema: {
							type: 'object',
							$ref: '#/components/schemas/UpdateUserRequest',
						},
					},
				],
				responses: {
					200: {
						description: 'user response',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UpdateSuccessResponse',
								},
							},
						},
					},
					default: {
						description: 'unexpected error',
						schema: {
							$ref: '#/components/schemas/Error',
						},
					},
				},
			},
			delete: {
				description: 'Deletes a single user based on the userId supplied',
				operationId: 'delete-user',
				tags: ['User'],
				parameters: [
					{
						name: 'userId',
						in: 'path',
						description: 'userId of user to delete',
						required: true,
						type: 'string',
						format: 'uuid',
					},
				],
				responses: {
					200: {
						description: 'user deleted',
						content: {
							'application/json': {
								schema: {
									$ref: '#/components/schemas/UpdateSuccessResponse',
								},
							},
						},
					},
					default: {
						description: 'unexpected error',
						schema: {
							$ref: '#/components/schemas/Error',
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			User: {
				type: 'object',
				properties: {
					firstName: {
						type: 'string',
					},
					lastName: {
						type: 'string',
					},
					phone: {
						type: 'integer',
					},
					email: {
						type: 'string',
					},
					organizationName: {
						type: 'string',
					},
					organizationPhone: {
						type: 'integer',
					},
					organizationEmail: {
						type: 'string',
					},
				},
			},
			NewUserRequest: {
				allOf: [
					{ $ref: '#/components/schemas/User' },
					{
						required: [
							'firstName',
							'lastName',
							'phoneCountryCode',
							'phone',
							'email',
							'organizationName',
							'organizationPhoneCountryCode',
							'organizationPhone',
							'organizationEmail',
						],
						properties: {
							phoneCountryCode: {
								type: 'integer',
							},
							organizationPhoneCountryCode: {
								type: 'integer',
							},
						},
					},
				],
			},
			UpdateUserRequest: {
				allOf: [
					{ $ref: '#/components/schemas/User' },
					{
						properties: {
							phoneCountryCode: {
								type: 'integer',
							},
							organizationPhoneCountryCode: {
								type: 'integer',
							},
						},
					},
				],
			},
			UserSuccessResponse: {
				type: 'object',
				properties: {
					firstName: {
						type: 'string',
					},
					lastName: {
						type: 'string',
					},
					phone: {
						type: 'string',
					},
					email: {
						type: 'string',
					},
					organizationName: {
						type: 'string',
					},
					organizationPhone: {
						type: 'string',
					},
					organizationEmail: {
						type: 'string',
					},
				},
			},
			NewSuccessResponse: {
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
								name: 'OK',
							},
						},
					},
					errors: {
						type: 'array',
					},
					result: {
						type: 'object',
						properties: {
							userId: {
								type: 'string',
								format: 'uuid',
							},
						},
					},
				},
			},
			FetchMultipleSuccessResponse: {
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
								name: 'OK',
							},
						},
					},
					errors: {
						type: 'array',
					},
					result: {
						type: 'object',
						properties: {
							count: {
								type: 'integer',
							},
							records: {
								type: 'array',
								items: {
									$ref: '#/components/schemas/UserSuccessResponse',
								},
							},
						},
					},
				},
			},
			FetchSingleSuccessResponse: {
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
								name: 'OK',
							},
						},
					},
					errors: {
						type: 'array',
					},
					result: {
						type: 'object',
						$ref: '#/components/schemas/UserSuccessResponse',
					},
				},
			},
			UpdateSuccessResponse: {
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
								name: 'OK',
							},
						},
					},
					errors: {
						type: 'array',
					},
					result: {
						type: 'object',
						properties: {
							count: {
								type: 'integer',
							},
						},
					},
				},
			},
		},
	},
};
