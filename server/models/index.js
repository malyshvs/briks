const sequelize = require("../config/db");
const User = require("./User");
const Contest = require("./Contest");
const News = require("./News");
const FAQ = require("./FAQ");
const initModels = async () => {
  await sequelize.sync();
};

module.exports = { initModels, User, Contest, News };
