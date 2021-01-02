const db = require("../models");
const FoodServing = db.foodServing;
const { QueryTypes, Op } = require('sequelize');
const Utils = require('../utils/utils');

// {"numMeasurementUnits":"1","calories":"100","foodId":1351,"measurementId":91}
exports.createFoodServing = (req, res) => {
  console.log(JSON.stringify(req.body));
  FoodServing.create({
    foodId: req.body.foodId,
    measurementId: req.body.measurementId,
    numMeasurementUnits: req.body.numMeasurementUnits,
    calories: req.body.calories
  }). then(foodServing => {
    res.status(200).send(foodServing);
  }).catch( err => {
    res.status(500).send({ message: err.message });
  })
  
};


