export const DEFAULT_ERROR_MESSAGE = 'Oops !!! Something went wrong.';
export const ENVIRONMENTS = ['local', 'development', 'testing', 'staging', 'production'];
export const API_RESPONSE_CODES = {
	OK: { statusCode: 200, defaultMessage: 'Success' },
	BadRequest: { statusCode: 400, defaultMessage: 'Invalid data provided' },
	Unauthorized: { statusCode: 401, defaultMessage: 'Unauthorized access' },
	SessionExpired: { statusCode: 401, defaultMessage: 'Session has been expired' },
	TokenExpired: { statusCode: 401, defaultMessage: 'Token has been expired' },
	InvalidApiKey: { statusCode: 401, defaultMessage: 'Invalid api key provided' },
	AccountSuspended: { statusCode: 401, defaultMessage: 'Account has been suspended' },
	PaymentRequired: { statusCode: 402, defaultMessage: 'Payment is required' },
	PermissionDenied: { statusCode: 403, defaultMessage: 'Permission denied' },
	NotFound: { statusCode: 404, defaultMessage: 'Resource not found' },
	MethodNotAllowed: { statusCode: 405, defaultMessage: 'Requested method is not allowed' },
	NotAcceptable: { statusCode: 406, defaultMessage: 'Not acceptable request' },
	ProxyAuthenticationRequired: { statusCode: 407, defaultMessage: 'Proxy authentication required' },
	RequestTimeout: { statusCode: 408, defaultMessage: 'Request timeout' },
	PayloadTooLarge: { statusCode: 413, defaultMessage: 'Payload too large' },
	URITooLong: { statusCode: 414, defaultMessage: 'URI too long' },
	TooManyRequest: { statusCode: 429, defaultMessage: 'Too many request' },
	HeaderTooLarge: { statusCode: 431, defaultMessage: 'Request header fields too large' },
	InternalServerError: { statusCode: 500, defaultMessage: DEFAULT_ERROR_MESSAGE },
	ThirdPartyError: { statusCode: 500, defaultMessage: 'Third party error' },
	UncaughtError: { statusCode: 500, defaultMessage: 'Uncaught error' },
	NotImplemented: { statusCode: 501, defaultMessage: 'Feature still now not implemented' },
	BadGateway: { statusCode: 502, defaultMessage: 'Bad gateway' },
	MaintenanceMode: { statusCode: 503, defaultMessage: 'This service is under maintenance' },
	GatewayTimeout: { statusCode: 504, defaultMessage: 'Gateway timeout' },
	HTTPVersionNotSupported: { statusCode: 505, defaultMessage: 'HTTP version not supported' },
};
export const NO_AUTH_ROUTES = [
	{ url: '/api/v1/users', methods: ['POST'] },
	{ url: '/', methods: ['GET'] },
	{ url: '/health-check', methods: ['GET'] },
	{ url: '/vitals', methods: ['GET'] },
	{ url: '/long-response', methods: ['GET'] },
	{ url: '/favicon.ico', methods: ['GET'] },
	{ url: '/api-docs', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-init.js', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui.css', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-bundle.js', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-standalone-preset.js', methods: ['GET'] },
	{ url: '/assets/css/apidoc.css', methods: ['GET'] },
];
export const DEFAULT_HASH_ALGO = 'sha256';

export const DEFAULT_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQBsIjykquRsW6+ZBk+vNEqCrb7D9yisMwUQMQWVyl1DBoblnOkl
2utf8Su+mUgtUxgt+erMzC1ZLyC2kXa1jyQPeMYJxvFZiJYG3ZLxUnTWVBzX2S9q
DfloXnMfNPiigmssJeo1QveNJ2c9LOku0V0ehMZ5Qvp/5hRZz64Ydubp+idB1u4N
9ev+Xe1FkQ01x804aKBClld6nXFAE+nGhViX/EzC/xB75RzL/UiCfdpVeprrUY5t
BYsFZSjoZvoPtQWuyK5zxJnZSXF4jLa017+i+mC+a8sXnRvrg5UdaI5DWmOy8129
afe3CQHO2+EaHj13zaxZCp4naHCRw6B+1vvJAgMBAAECggEANAAS4a08w88jlpcu
Yrbmzgj3oA2PhZ/TY4HviaUTTFQrMuhORmIMpsq3mqTjzMgU7KcufuYBOM4tER7K
02zOjpIpyjHdhozkeNC9BUf938P7SuGqp3mo4sPo4Kz8lEnbeBOTmaFmon68avLa
ACW2fiKjv1SyWicuyjHRKvqi+QkvBt/KCHsgqHWYfJtO/5OBtJSdjKm87hIQ4Fcw
uKheBa+/0MaLy3BcwQGNJS6NkeMNPVxCR/6GcNRdTWNi0Ctehv0i6vGqCGpSpHCP
yI0zfcZ+JfzwrBK3Hm/hrDC7lKVc1KZVJgK8TC5j2kSyZotgs5Dc3MYdPYum+okk
7F0qwQKBgQCtZ9JzGiUfYYZXfBkxsFHIVzq7rOVVrfmdrSz5dKrU9kL4RM0Idc8z
yitYqoKIuXT/r29Dn+CsLUj6NtpZ+6Szu3vf5p1JhBS9Rgfbes4iXiyu0af17xuO
8yVk6/y86y4zvhM/919zfnenmR44NmFIXHTndxlvpPRlB2vDlCAwBQKBgQCfo4Gp
k05/1rk6/O+wagzmHAjuzyRfBNNnCGxOtWYCuLanTzGSY39HQO6kT7cQfjjijJzt
B21Wzst01Ay0dEDO1AvGp8JjMYcDKVzj3EJgY1ygHZtkRlaSMSN5sCaUkwHGJelt
Pq7GQJqUZZBUKHm9IfZZWuqBK6lTp1MXUv6b9QKBgBESS5GxXT49p7AtM33E0ghb
LhkT6HAK9KwlRGw6pCbbJ7SxcU4H6yI6IRJVlwxG1dHmP5n0v3Wz759SjySUtZ5M
MuHUHmACdNg9cMCW0nxnsRZ05Yg8xgXIwkGxSex/askFSXferrL8HGOPm34FPIaX
M5smCocHQlg/5sgWaSTRAoGANh/tulzjZJycuM9BRQLv1KT0smMw5bZxJqHIdvcx
2wJdi2RiXku1v6bYQoV0f/cLumQKYKMAA0qh2L58gEJaJsXmKDiAw7jrGbtQb0Ei
kCOgJ/lh0iG3AGIAsSV0LzOYimIYPp3eDAGjZ2T4BlCi1elJ6QnWMG1pP5+foGzX
PnECgYBe1pG+DxP7dYJWhdkHLXczBq4vza3hXBFJVIeiNTbEIxkqgvhtr3zMiMs5
/ct1vLsmzvG5HqOHFlJLdOyU0hHmQZEOZn9XwDTKvjc0EWcal8xagw5GZUhNboe3
R3B15PHZL2PkRtgA1HB08Pmd++qbaiWRF02sNB58tkTQhiifIA==
-----END RSA PRIVATE KEY-----`;
export const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBsIjykquRsW6+ZBk+vNEqC
rb7D9yisMwUQMQWVyl1DBoblnOkl2utf8Su+mUgtUxgt+erMzC1ZLyC2kXa1jyQP
eMYJxvFZiJYG3ZLxUnTWVBzX2S9qDfloXnMfNPiigmssJeo1QveNJ2c9LOku0V0e
hMZ5Qvp/5hRZz64Ydubp+idB1u4N9ev+Xe1FkQ01x804aKBClld6nXFAE+nGhViX
/EzC/xB75RzL/UiCfdpVeprrUY5tBYsFZSjoZvoPtQWuyK5zxJnZSXF4jLa017+i
+mC+a8sXnRvrg5UdaI5DWmOy8129afe3CQHO2+EaHj13zaxZCp4naHCRw6B+1vvJ
AgMBAAE=
-----END PUBLIC KEY-----`;
export const DEFAULT_JWT_ALGO = 'RS256';
export const SENSITIVE_KEYS = ['password', 'creditCard'];
export const NO_LOG_ROUTES = [
	{ url: '/', methods: ['GET'] },
	{ url: '/health-check', methods: ['GET'] },
	{ url: '/vitals', methods: ['GET'] },
	{ url: '/long-response', methods: ['GET'] },
	{ url: '/favicon.ico', methods: ['GET'] },
	{ url: '/api-docs', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-init.js', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui.css', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-bundle.js', methods: ['GET'] },
	{ url: '/api-docs/swagger-ui-standalone-preset.js', methods: ['GET'] },
	{ url: '/assets/css/apidoc.css', methods: ['GET'] },
];
