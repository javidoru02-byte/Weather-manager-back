const { ValidationError } = require('yup');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      errors: [
        {
          title: 'Validation error',
          details: err.errors,
        },
      ],
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      errors: [
        {
          title: 'Conflict: duplicate entry already exists',
          details: err.detail,
        },
      ],
    });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? 'Internal server error' : err.message || 'Error occurred';

  if (status === 500) {
    console.error('Server Error:', err);
  }

  res.status(status).json({
    errors: [
      {
        title: message,
      },
    ],
  });
};

module.exports = errorHandler;
