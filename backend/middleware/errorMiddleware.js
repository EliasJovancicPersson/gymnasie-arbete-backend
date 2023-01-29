const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  console.log(statusCode);

  res.json({
    message: err.message,
    stack: process.env.Node_ENV === "production" ? null : err.stack,
  });
};

module.exports = { ErrorHandler };
