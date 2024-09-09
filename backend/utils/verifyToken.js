import  jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(401, "Unauthorized user");
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(403, "Forbidden");
      }
   
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
