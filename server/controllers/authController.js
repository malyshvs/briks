const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Contest = require("../models/Contest");
const { v4: uuidv4 } = require("uuid");
const Mailer = require("../utils/sendEmail");
const SECRET = "Lazareva1"; // перенести в .env

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Недействительная ссылка подтверждения" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email подтвержден" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Пользователь не найден" });
    if (!user.isVerified)
      return res.status(401).json({ message: "Email не подтвержден" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Нет токена" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Lazareva1");
    const user = await User.findByPk(decoded.userId);

    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    // Получаем заявку пользователя (если есть)
    const contestApplication = await Contest.findOne({
      where: { userId: user.id },
      attributes: ["status"], // статус заявки
    });

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      nickname: user.nickname,
      birthDate: user.birthDate,
      phone: user.phone,
      citizenship: user.citizenship,
      registrationAddress: user.registrationAddress,
      role: user.role,
      avatar: user.avatar || "",
      hasAppliedToContest: user.hasAppliedToContest,
      contestStatus: contestApplication ? contestApplication.status : null,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Недействительный токен" });
  }
};

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    nickname,
    password,
    birthDate,
    phone,
    citizenship,
    registrationAddress,
    avatar,
  } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email уже зарегистрирован" });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    let avatarPath = avatar || null;
    if (req.file) {
      avatarPath = `uploads/${req.file.filename}`;
    }

    await User.create({
      fullName,
      email,
      nickname,
      passwordHash,
      birthDate,
      phone,
      citizenship,
      registrationAddress,
      avatar: avatarPath,
      verificationToken,
      hasAppliedToContest: false,
    });
    Mailer.sendVerificationEmail(email, verificationToken);
    console.log(
      `🔗 Email Verification Link: http://localhost:5000/api/auth/verify/${verificationToken}`
    );
    res.status(201).json({
      message: "Регистрация успешна. Проверьте email для подтверждения.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Lazareva1");

    const user = await User.findByPk(decoded.userId);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    const {
      fullName,
      nickname,
      birthDate,
      phone,
      citizenship,
      registrationAddress,
      avatar,
    } = req.body;

    let avatarPath = avatar || user.avatar;
    if (req.file) {
      avatarPath = `uploads/${req.file.filename}`;
    }

    await user.update({
      fullName,
      nickname,
      birthDate,
      phone,
      citizenship,
      registrationAddress,
      avatar: avatarPath,
    });

    res.json({ message: "Профиль обновлен", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка обновления профиля" });
  }
};
exports.applyToContest = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Нет токена" });

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    if (user.role !== "Пользователь") {
      return res.status(403).json({
        message:
          "Только пользователи с ролью 'Пользователь' могут подавать заявки",
      });
    }

    if (user.hasAppliedToContest) {
      return res.status(400).json({ message: "Заявка уже подана" });
    }

    const { track, projectName, projectDescription, presentationLink, city } =
      req.body;

    // Создаем заявку
    await Contest.create({
      userId: user.id,
      track,
      projectName,
      projectDescription,
      presentationLink,
      city,
    });

    // Обновляем поле пользователя
    user.hasAppliedToContest = true;
    await user.save();

    res.status(201).json({ message: "Заявка успешно подана" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.getAllContestApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Lazareva1");

    const user = await User.findByPk(decoded.userId);
    if (!user || (user.role !== "Модератор заявок" && user.role !== "admin")) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    const applications = await Contest.findAll({
      include: [{ model: User, attributes: ["fullName", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка получения заявок" });
  }
};
exports.approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findByPk(id);
    if (!contest) return res.status(404).json({ message: "Заявка не найдена" });

    contest.status = "approved";
    await contest.save();
    res.json({ message: "Заявка одобрена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка одобрения заявки" });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findByPk(id);
    if (!contest) return res.status(404).json({ message: "Заявка не найдена" });

    contest.status = "rejected";
    await contest.save();
    res.json({ message: "Заявка отклонена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка отклонения заявки" });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// Получить одного пользователя
exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Не найден" });
  res.json(user);
};

// Обновить пользователя
exports.updateUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Не найден" });

  const { fullName, email, nickname, role } = req.body;
  await user.update({ fullName, email, nickname, role });

  res.json(user);
};

// Получить заявки по треку и статусу
exports.getApprovedByTrack = async (req, res) => {
  const { track } = req.params;
  try {
    const contests = await Contest.findAll({
      where: { track, status: "approved" },
      include: [
        { model: User, attributes: ["fullName", "nickname", "citizenship"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(contests);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении данных" });
  }
};
