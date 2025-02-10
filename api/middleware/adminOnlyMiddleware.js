const adminOnlyMiddleware = (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next(); // Proceed if the user is an admin
  };
  
  export { adminOnlyMiddleware };
  