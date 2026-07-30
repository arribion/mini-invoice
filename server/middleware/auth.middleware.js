import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies?.accessToken;

  // DEBUG
  //  console.log(" protect middleware → cookies:", req.cookies);
  //  console.log(" protect middleware → token:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET,
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token invalid",
    });
  }
};
