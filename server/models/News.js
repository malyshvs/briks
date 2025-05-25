const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const News = sequelize.define("News", {
  title: DataTypes.STRING,
  preview: DataTypes.STRING, // краткое описание
  previewImage: DataTypes.STRING, // ссылка на картинку
  content: DataTypes.TEXT, // HTML
  isHidden: { type: DataTypes.BOOLEAN, defaultValue: false },
  archived: { type: DataTypes.BOOLEAN, defaultValue: false },
});

News.belongsTo(User, { as: "author", foreignKey: "userId" });

module.exports = News;
