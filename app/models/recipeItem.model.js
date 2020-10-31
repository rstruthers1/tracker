const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const RecipeItem = sequelize.define("recipe_items", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY
    },
    servings: {
      type: DataTypes.DECIMAL(12,6)
    },
    comments: {
      type: Sequelize.STRING
    },
    foodId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'foods',
        key: 'id'
      }
    },
    recipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'recipes',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  return RecipeItem;
};
