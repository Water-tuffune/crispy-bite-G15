const allowRoles = (...roles) => {
  return (req, res, next) => {
    // Role checks keep one authenticated user type from using another dashboard API.
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action." });
    }

    next();
  };
};

module.exports = { allowRoles };
