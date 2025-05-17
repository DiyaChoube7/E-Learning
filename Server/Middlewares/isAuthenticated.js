const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not Authenticated !!",
      });
    }
    const decoded = await jwt.verify(token, process.env.secretKey);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token !!",
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Log out !!",
    });
  }
};

module.exports = {
  isAuthenticated,
};
