const News = require("../models/News");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getUserFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Lazareva1");
    return decoded;
  } catch {
    return null;
  }
};

exports.getAllNews = async (req, res) => {
  const user = getUserFromToken(req);

  const where =
    user?.role === "admin" || user?.role === "forum_moderator"
      ? {} // показать всё
      : { archived: false }; // скрыть архивные для обычных пользователей

  try {
    const news = await News.findAll({
      where: { archived: false, isHidden: false },
      include: [{ model: User, as: "author", attributes: ["id", "fullName"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка получения новостей" });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Новость не найдена" });

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения новости" });
  }
};

exports.createNews = async (req, res) => {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: "Неавторизованный пользователь" });
    }

    const { title, preview, previewImage, content } = req.body;

    const newNews = await News.create({
      title,
      preview,
      previewImage,
      content,
      authorId: user.id,
    });

    res.status(201).json(newNews);
  } catch (err) {
    console.error("Ошибка при создании новости:", err);
    res.status(500).json({ message: "Ошибка создания новости" });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Новость не найдена" });

    const { title, preview, previewImage, content } = req.body;
    await news.update({ title, preview, previewImage, content });

    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления новости" });
  }
};

exports.archiveNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Новость не найдена" });

    await news.update({ archived: true });

    res.json({ message: "Новость скрыта (в архиве)" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка скрытия новости" });
  }
};
