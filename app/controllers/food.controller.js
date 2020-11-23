const db = require("../models");
const Food = db.food;
const { QueryTypes, Op } = require('sequelize');
const Utils = require('../utils/utils');

exports.foodSubmitted = (req, res) => {
  console.log("food.diary.controller");
  console.log("foodSubmitted!!!");
  console.log(JSON.stringify(req.body));
  Food.create({
    description: req.body.description,
    servingSize: req.body.servingSize,
    calories: req.body.calories
  }). then(food => {
    res.status(200).send(food);
  }).catch( err => {
    res.status(500).send({ message: err.message });
  })

};

exports.deleteFood = (req, res) => {
  let foodId = req.params.id;
  Food.destroy({
    where:
      {id: foodId}
  }).then(() => {
    res.status(200).send(
      {
        message: "success",
        foodId: foodId
      });
  }).catch(err => {
    console.log(JSON.stringify(err));
    let message = err.name;
    let status = 500;
    if (err.name == "SequelizeForeignKeyConstraintError") {
      message = "Cannot delete food as it is in use by another item such as a food diary or recipe.";
      status = 400;
    }
    res.status(status).send({
      message: message
    })
  });

};

exports.getAllFoods = (req, res) => {
  Food.findAll({

    order: [['description', 'ASC']]
  }).then(foods => {
    res.status(200).send(foods);
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });
};

exports.getFoodsFiltered = (req, res) => {
  console.log("****PARAMS: " + JSON.stringify(req.params));
  const filterValue = req.params.filterValue;
  Food.findAll({
    where: {
      description: {
        [Op.like]: `%${filterValue}%`
      }
    },
    order: [['description', 'ASC']]
  }).then(foods => {
    res.status(200).send(foods);
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });
};
