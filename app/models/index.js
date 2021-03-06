const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.food = require("../models/food.model")(sequelize, Sequelize);
db.foodDiaryItem = require("../models/foodDiaryItem.model")(sequelize, Sequelize);
db.recipe = require("../models/recipe.model")(sequelize, Sequelize);
db.recipeItem = require("../models/recipeItem.model")(sequelize, Sequelize);
db.image = require("../models/image.model")(sequelize, Sequelize);
db.measurement = require("../models/measurement.model")(sequelize, Sequelize);
db.foodServing = require("../models/foodServing.model")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
