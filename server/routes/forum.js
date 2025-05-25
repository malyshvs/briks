const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");
const Post = require("../models/Post");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Получить все темы с аватарками авторов
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["nickname", "avatar"] }],
    });
    res.json(topics);
  } catch (error) {
    console.error("Ошибка при получении тем:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получить тему с аватаром автора
router.get("/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["nickname", "avatar"] }],
    });

    if (!topic) return res.status(404).json({ message: "Тема не найдена" });

    res.json(topic);
  } catch (error) {
    console.error("Ошибка при получении темы:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создать новую тему + первый пост
router.post("/topics", authMiddleware, async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const topic = await Topic.create({ title, userId });

    await Post.create({
      content: description,
      authorId: userId,
      TopicId: topic.id,
    });

    res.status(201).json({ id: topic.id });
  } catch (error) {
    console.error("Ошибка при создании темы:", error);
    res.status(500).json({ message: "Ошибка сервера при создании темы" });
  }
});

// Получить все сообщения по теме с аватарками авторов
router.get("/topics/:id/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { TopicId: req.params.id },
      include: [{ model: User, attributes: ["nickname", "avatar"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(posts);
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
    res.status(500).json({ message: "Ошибка сервера при получении постов" });
  }
});

// Добавить сообщение в тему
router.post("/topics/:id/posts", authMiddleware, async (req, res) => {
  const { authorId, content } = req.body;

  try {
    const post = await Post.create({
      content,
      authorId,
      TopicId: req.params.id,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Ошибка при добавлении поста:", error);
    res.status(500).json({ message: "Ошибка сервера при добавлении поста" });
  }
});

// Редактирование поста
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (post.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Нет доступа для редактирования" });
    }

    post.content = content;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Ошибка при редактировании поста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление поста
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Пост не найден" });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: "Нет доступа для удаления" });
    }

    await post.destroy();

    res.json({ message: "Пост успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении поста:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
