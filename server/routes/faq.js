const express = require("express");
const router = express.Router();

const faqController = require("../controllers/FAQ");
const authMiddleware = require("../middleware/authMiddleware");

// Получить все FAQ (доступно всем)
router.get("/", faqController.getAllFAQs);

// Создание, обновление, удаление — только admin
router.post(
  "/",
  authMiddleware,
  authMiddleware.adminMiddleware,
  faqController.createFAQ
);
router.put(
  "/:id",
  authMiddleware,
  authMiddleware.adminMiddleware,
  faqController.updateFAQ
);
router.delete(
  "/:id",
  authMiddleware,
  authMiddleware.adminMiddleware,
  faqController.deleteFAQ
);

module.exports = router;
