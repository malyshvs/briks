const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Topic = sequelize.define("Topic", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Topic.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Topic, { foreignKey: "userId" });

module.exports = Topic;
