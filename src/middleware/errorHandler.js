module.exports = (err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
};
