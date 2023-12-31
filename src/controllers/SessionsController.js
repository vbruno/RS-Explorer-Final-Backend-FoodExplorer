const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;
    if (!email || !password) {
      throw new AppError('Missing body parameter', 400);
    }

    const user = await knex('users').where({ email }).first();
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    delete user.password;

    return response.json({ user, token });
  }
}

module.exports = SessionsController;
