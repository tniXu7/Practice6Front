// index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());  // Разрешить запросы с разных доменов
app.use(express.json()); // Для парсинга JSON в теле запроса

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});