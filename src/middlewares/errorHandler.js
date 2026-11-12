function notFoundHandler(req, res, next) {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
}

// Повідомлення для порушень унікальності — залежать від constraint, а не від таблиці 
const UNIQUE_VIOLATION_MESSAGES = {
  users_email_key: 'emailAlreadyExists',
  favourite_weather_pkey: 'cityAlreadyInFavourites',
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'validationError',
      errors: err.errors,
    });
  }

  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'invalidJson' });
  }

  
  if (err.code === '23505') {
    return res.status(409).json({
      message: UNIQUE_VIOLATION_MESSAGES[err.constraint] || 'alreadyExists',
    });
  }

  if (err.code === '23503') {
    return res.status(404).json({ message: 'userNotFound' });
  }

  if (err.code === '22P02' || err.code === '22003') {
    return res.status(400).json({ message: 'invalidParameter' });
  }

  if (!err.status) {
    console.error(err);
    return res.status(500).json({ message: 'serverError' });
  }

  res.status(err.status).json({ message: err.message });
}

module.exports = { notFoundHandler, errorHandler };
