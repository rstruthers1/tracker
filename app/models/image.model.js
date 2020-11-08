const { Model, DataTypes, Deferrable } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define("images", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER
    },
    fileName: {
      type: Sequelize.STRING
    },
    fileType: {
      type: Sequelize.STRING
    },
    imageUuid: {
        type: Sequelize.STRING
      },
    url: {
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

  return Image;
};
