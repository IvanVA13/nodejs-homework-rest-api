const { TooManyRequests } = require('http-errors');

const httpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const statusCode = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const message = {
  NOT_FOUND: 'Not found :(',
  BAD_EMAIL_OR_PASSWORD: 'Email or password is wrong',
  NOT_AUTHORIZED: 'Not authorized',
  CONFLICT: 'Email in use',
  TOO_MANY_REQUESTS: 'Too mach requests, try later...',
  DB_CONNECT_SUCCESS: 'Database connection successful',
  DB_CONNECT_TERMINATED: 'Connection to database terminated',
  DB_CONNECT_ERROR: 'Error connection to db:',
  VERIFY_SUCCESS: 'Verification successful',
  VERIFY_RESEND: 'Verification email sent',
};

const reqLimiterAPI = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: (_, __, ___) => {
    throw new TooManyRequests(message.TOO_MANY_REQUESTS);
  },
};

module.exports = {
  httpCode,
  message,
  statusCode,
  reqLimiterAPI,
};
