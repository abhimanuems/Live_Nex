import jwt from "jsonwebtoken";

const protect = (async (req, res, next) => {
  console.log("enterd at the protect");
  let token;

  console.log(cookies)
  token = req.cookies.jwt;
  console.log(token)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded)

    //   req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };