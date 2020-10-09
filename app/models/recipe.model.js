const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Recipe = sequelize.define("recipes", {
    name: {
      type: Sequelize.STRING
    },
    servings: {
      type: Sequelize.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  return Recipe;
};
