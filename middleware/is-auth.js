// module.exports = (req, res, next) => {
//     if (!req.session.isLoggedIn) {
//         return res.redirect('/login');
//     }
//     next();
// }

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.log("Not authenticateddd");
    return next();
  }

  const token = req.get('Authorization').split(' ')[1];
  console.log('Received token:', token);

  try {
    decodedToken = jwt.verify(token, 'somesecrettoken');
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ error: "Invalid token" });
  }

  if (!decodedToken) {
    console.log("Not authenticated");
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  req.userId = decodedToken.userId;
  next();
};
