const db = require("../models");
const Food = db.foodServing;
const { QueryTypes, Op } = require('sequelize');
const Utils = require('../utils/utils');

exports.createFoodServing = (req, res) => {
  console.log(JSON.stringify(req.body));
  // Food.create({
  //   description: req.body.description,
  //   servingSize: req.body.servingSize,
  //   calories: req.body.calories
  // }). then(food => {
  //   res.status(200).send(food);
  // }).catch( err => {
  //   res.status(500).send({ message: err.message });
  // })
  res.status(200).send("hello from createFoodServing");
};


