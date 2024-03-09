var jwt = require("jsonwebtoken");
const JET_SECRET = process.env.JET_SECRET;

const fetchuser = (req, res, next) => {
  // get the user frm the jwt token and add  id to req object
  const token = req.header("auth-token");
  if (!token) {
     res
      .status(401)
      .send({ error: "please authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, JET_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
};
module.exports = fetchuser;
