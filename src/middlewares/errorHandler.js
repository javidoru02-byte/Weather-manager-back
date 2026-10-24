const UNIQUE_VIOLATIONS = {
  users_email_key: 'User with this email already exists',
  favourites_user_id_city_name_key: 'This city is already in favourites',
};

function notFoundHandler(req, res, next) {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
  }

  if (err.code === '23505') {
    const message =
      UNIQUE_VIOLATIONS[err.constraint] || 'Record already exists';
    return res.status(409).json({ message });
  }

  if (err.code === '23503') {
    return res.status(400).json({ message: 'Referenced user does not exist' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}

module.exports = { notFoundHandler, errorHandler };
