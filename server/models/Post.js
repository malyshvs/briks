const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Topic = require("./Topic");
const User = require("./User");

const Post = sequelize.define("Post", {
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Topic.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(Topic);

User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "authorId" });

module.exports = Post;
