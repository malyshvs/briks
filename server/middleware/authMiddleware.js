const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "Lazareva1"); // замените на ваш секрет
    req.user = await User.findByPk(decoded.userId);
    if (!req.user)
      return res.status(401).json({ message: "Пользователь не найден" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Неверный токен" });
  }
};

// Добавляем adminMiddleware как свойство к основной функции
authMiddleware.adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Доступ запрещён" });
  }
};

module.exports = authMiddleware;
