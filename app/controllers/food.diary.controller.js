const db = require("../models");
const config = require("../config/auth.config");
const Food = db.food;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.foodDiary = (req, res) => {
  console.log("food.diary.controller")
  res.status(200).send("Food diary content");
};

exports.foodSubmitted = (req, res) => {
  console.log("food.diary.controller");
  console.log("foodSubmitted!!!");
  console.log(JSON.stringify(req.body));
  Food.create({
    description: req.body.description,
    servingSize: req.body.servingSize,
    calories: req.body.calories
  }). then(food => {
    res.status(200).send({message: "Food was created successfully!"});
  }).catch( err => {
    res.status(500).send({ message: err.message });
  })

};
