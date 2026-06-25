class AppError extends Error {
  constructor(message, statusCode) {
    super('Application Error');
    this.statusCode  = statusCode;
    this.explanation = Array.isArray(message) ? message : [message];
  }
}

module.exports = AppError;