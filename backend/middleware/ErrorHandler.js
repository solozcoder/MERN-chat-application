const ErrorHandler = (err, req, res, next) => {
  const StatusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(StatusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = ErrorHandler;
