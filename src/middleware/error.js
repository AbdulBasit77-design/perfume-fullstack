export const notFound = (_req, res, _next) => {
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
};
