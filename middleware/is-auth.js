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
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, 'somesecrettoken');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};
