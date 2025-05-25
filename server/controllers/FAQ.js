const FAQ = require("../models/FAQ");

// Получить все FAQ
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Создать новый FAQ (только admin)
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Вопрос и ответ обязательны" });
    }

    const faq = await FAQ.create({ question, answer });
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Обновить FAQ по id (только admin)
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ не найден" });
    }

    faq.question = question ?? faq.question;
    faq.answer = answer ?? faq.answer;
    await faq.save();

    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удалить FAQ (только admin)
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ не найден" });
    }
    await faq.destroy();
    res.json({ message: "FAQ удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
