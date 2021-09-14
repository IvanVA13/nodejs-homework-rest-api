const req = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../model/db');
const User = require('../model/user');
const newUser = require('./data/data');
const { updateUserToken, updateUserAvatar } = require('../repositories/users');
const { httpCode, message, statusCode } = require('../helpers/constants');
require('dotenv').config();
const fs = require('fs/promises');

describe('Test Avatars', () => {
  let user, token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await User.create(newUser);
    const { SECRET_KEY } = process.env;
    const addToken = (payload, secret) => jwt.sign(payload, secret);
    token = addToken({ id: user._id }, SECRET_KEY);
    await updateUserToken(user._id, token);
  });

  afterAll(async () => {
    const testDb = await db;
    await User.deleteOne({ email: newUser.email });
    await testDb.disconnect();
  });

  // it('avatar success update', async () => {
  //   const avatar = await fs.readFile('./data/ava.png');
  //   const res = await req(app)
  //     .patch('/api/users/avatars')
  //     .set('Authorization', `Bearer ${token}`)
  //     .attach('avatar', avatar, 'ava.png');
  //   expect(res.status).toEqual(httpCode.OK);
  //   expect(res.body).toBeDefined();
  //   expect(res.body.data).toEqual(
  //     expect.objectContaining({
  //       avatarUrl: expect.any(String),
  //     }),
  //   );
  // });
  it('status 401 when user unauthorized', async () => {
    token = 'bad token';
    const res = await req(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(httpCode.UNAUTHORIZED);
  });
});
