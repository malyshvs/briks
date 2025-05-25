const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Contest = sequelize.define("Contest", {
  track: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  presentationLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending", // варианты: pending, approved, rejected
  },
});

// Связь заявки с пользователем
Contest.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Contest, { foreignKey: "userId" });

module.exports = Contest;
