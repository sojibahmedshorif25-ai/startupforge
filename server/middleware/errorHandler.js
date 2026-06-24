const errorHandler = (err, req, res, next) => {
  console.error('\n========== ERROR ==========');
  console.error('Time:', new Date().toISOString());
  console.error('URL:', req.method, req.originalUrl);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('===========================\n');

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    success: false,
  });
};

export default errorHandler;
