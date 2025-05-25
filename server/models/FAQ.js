const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FAQ = sequelize.define("FAQ", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = FAQ;
