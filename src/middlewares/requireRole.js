const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: You do not have permission"
      });
    }
    next();
  };
};

export default requireRole;
