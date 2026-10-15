function notFoundHandler(req, res, next) {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }

  if (err.code === "23505") {
    return res
      .status(409)
      .json({ message: "This city is already in favourites" });
  }

  if (err.code === "23503") {
    return res.status(400).json({ message: "Referenced user does not exist" });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
}

module.exports = { notFoundHandler, errorHandler };
