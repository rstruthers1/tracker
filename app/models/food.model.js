const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Food = sequelize.define("foods", {
    description: {
      type: Sequelize.STRING
    },
    servingSize: {
      type: Sequelize.STRING
    },
    calories: {
      type: DataTypes.INTEGER
    }
  });

  return Food;
};
