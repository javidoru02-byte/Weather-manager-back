const { verifyToken } = require('../utils/jwt');
const httpError = require('../utils/httpError');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(httpError(401, 'tokenMissing'));
  }

  const token = authHeader.slice('Bearer '.length).trim();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id };
    next();
  } catch {
    next(httpError(401, 'invalidToken'));
  }
}

module.exports = authenticate;
