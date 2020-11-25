const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const FoodServing = sequelize.define("food_servings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    foodId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'foods',
        key: 'id'
      }
    },
    measurementId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'measurements',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    calories: {
      type: DataTypes.INTEGER
    },
    numMeasurementUntis: {
      type: DataTypes.DECIMAL(12,6)
    },
  });

  return FoodServing;
};
