const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Measurement = sequelize.define("measurements", {
    name: {
      type: Sequelize.STRING
    }
  });

  return Measurement;
};
