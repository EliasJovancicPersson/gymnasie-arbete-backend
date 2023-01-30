const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  console.log(statusCode);

  res.set({
    "Access-Control-Allow-Origin": "https://127.0.0.1:5500",
    "Access-Control-Allow-Headers": "content-type",
  });

  res.json({
    message: err.message,
    stack: process.env.Node_ENV === "production" ? null : err.stack,
  });
};

module.exports = { ErrorHandler };
