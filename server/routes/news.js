const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

// Получить все новости (с учётом роли)
router.get("/", newsController.getAllNews);

// Получить одну новость по ID
router.get("/:id", newsController.getNewsById);

// Добавить новость
router.post("/", newsController.createNews);

// Обновить новость
router.put("/:id", newsController.updateNews);

// Архивировать (скрыть) новость
router.put("/:id/hide", newsController.archiveNews);

module.exports = router;
