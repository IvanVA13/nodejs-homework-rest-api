const passport = require('passport');
const { httpCode, message, statusCode } = require('../helpers/constants');
const guard = require('../helpers/guard');

describe('Unit test authentication', () => {
  const user = { token: 'test-token' };
  const req = { get: jest.fn(() => `Bearer ${user.token}`), user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(data => data),
  };
  const next = jest.fn();
  it('user exist', async () => {
    passport.authenticate = jest.fn((strategy, opt, cb) => (req, res, next) => {
      cb(null, user);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it('user not exist', async () => {
    passport.authenticate = jest.fn((strategy, opt, cb) => (req, res, next) => {
      cb(null, false);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: statusCode.UNAUTHORIZED,
      code: httpCode.UNAUTHORIZED,
      message: message.NOT_AUTHORIZED,
    });
  });
  it('invalid user token', async () => {
    const badToken = { token: 'invalid-token' };
    passport.authenticate = jest.fn((strategy, opt, cb) => (req, res, next) => {
      cb(null, badToken);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: statusCode.UNAUTHORIZED,
      code: httpCode.UNAUTHORIZED,
      message: message.NOT_AUTHORIZED,
    });
  });
  it('exception occurred', async () => {
    const err = new Error('exception occurred');
    passport.authenticate = jest.fn((strategy, opt, cb) => (req, res, next) => {
      cb(err, user);
    });
    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: statusCode.UNAUTHORIZED,
      code: httpCode.UNAUTHORIZED,
      message: message.NOT_AUTHORIZED,
    });
  });
});
