const db = require("../models");
const Food = db.food;
const { QueryTypes, Op } = require('sequelize');
const Utils = require('../utils/utils');

exports.createFood = (req, res) => {
  console.log(JSON.stringify(req.body));
  let food = req.body;
  Food.create({
    description: food.description,
    servingSize: food.servingSize,
    calories: food.calories,
    grams: food.grams
  }). then(food => {
    res.status(200).send(food);
  }).catch( err => {
    res.status(500).send(err);
  })

};

exports.updateFood = (req, res) => {
  console.log(JSON.stringify(req.body));
  let food = req.body;
  if (!food.id) {
    res.status(400).send({message: "No food id provided, cannot update"});
    return;
  }   
  Food.update(
    {
      description: food.description,
      servingSize: food.servingSize,
      calories: food.calories,
      grams: food.grams
    },
    {
      where: {
        id: food.id
      }
    }).then(() => {
    res.status(200).send({message: "food successfully updated"});
  }).catch(err => {
    console.log(JSON.stringify(err));
    res.status(500).send({message: err})
  });
  
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
    console.log(JSON.stringify(err));
    res.status(500).send(err);
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
