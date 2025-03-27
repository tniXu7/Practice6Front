// middleware/auth.js
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; //  Используйте тот же секретный ключ

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user; // Добавляем информацию о пользователе в объект запроса
        next();
    });
}

module.exports = authMiddleware;