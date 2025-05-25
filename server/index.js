const express = require("express");
const cors = require("cors");
const { initModels } = require("./models");
const authRoutes = require("./routes/auth");
const forumRoutes = require("./routes/forum");
const path = require("path");
const newsRoutes = require("./routes/news");
const faqRoutes = require("./routes/faq");

const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = require("./config/db");
const User = require("./models/User");

app.use(cors());
app.use(express.json());

app.use("/api/faq", faqRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/news", newsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.get("/", (req, res) => {
  res.send("BRICS Contest API is working!"), console.log("123");
});

app.get("/debug/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

initModels().then(() => {
  app.listen(PORT, () =>
    console.log(` Server running on http://localhost:${PORT}`)
  );
});
