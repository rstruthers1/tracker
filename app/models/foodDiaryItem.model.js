const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const FoodDiaryItem = sequelize.define("food_diary_items", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    meal: {
      type: Sequelize.STRING
    },
    date: {
      type: DataTypes.DATEONLY
    },
    foodId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'foods',
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

  return FoodDiaryItem;
};
