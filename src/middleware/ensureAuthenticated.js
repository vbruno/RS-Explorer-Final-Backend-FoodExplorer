const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, authConfig.jwt.secret);

    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}

module.exports = ensureAuthenticated;
