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
    },
    measurementUnitId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'measurements',
        key: 'id'
      }
    },
      numMeasurementUnits: {
      type: DataTypes.DECIMAL(12,6)
    },
    grams: {
      type: DataTypes.DECIMAL(12,6)
    },
    volumeUnit: {
      type: Sequelize.STRING
    },
    volumeAmount: {
      type: Sequelize.STRING
    },
    defaultUnit: {
      type: Sequelize.STRING
    }
  });

  return Food;
};
