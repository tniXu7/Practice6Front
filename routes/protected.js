// routes/protected.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Импортируем middleware

// Защищенный маршрут
router.get('/data', authMiddleware, (req, res) => {
    // Если пользователь аутентифицирован, req.user будет содержать информацию о пользователе
    res.json({ message: 'Protected data!', user: req.user });
});

module.exports = router;