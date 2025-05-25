const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Message = sequelize.define("Message", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Message.belongsTo(User, { as: "author" });

module.exports = Message;
