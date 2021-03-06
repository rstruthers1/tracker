const db = require("../models");
const FoodDiaryItem = db.foodDiaryItem;
const { QueryTypes, Op } = require('sequelize');
const Utils = require('../utils/utils');


exports.foodDiary = (req, res) => {
  console.log("food.diary.controller");
  db.sequelize.query("SELECT fdi.id, fdi.meal, fdi.date, fdi.servings, " +
    "f.description, f.calories, f.servingSize " +
    "from food_diary_items fdi " +
    "join foods f on fdi.foodId = f.id " +
    "join users u on fdi.userId = u.id " +
    `where fdi.date = '${req.query.date}' ` +
    `and u.id = ${req.userId}`
    , {type: QueryTypes.SELECT}).then(foods => {
    console.log(JSON.stringify(foods));
    res.status(200).send(foods);
  }).catch(err => {
    console.log(JSON.stringify(err));
    res.status(500).send("error getting all the foods")
  });
};

exports.deleteFoodDiaryItem = (req, res) => {
  FoodDiaryItem.destroy({
    where:
      {
        id: req.query.id,
        userId: req.userId
      }
  }).then(() => {
    res.status(200).send("delete food diary item response");
  }).catch(err => {
    console.log(JSON.stringify(err));
    res.status(500).send("error deleting food item")
  });
};


exports.updateFoodDiaryItem = (req, res) => {
  console.log("updateFoodDiaryItem: " + JSON.stringify(req.body));
  FoodDiaryItem.update(
    {servings: req.body.servings},
    {
      where: {
        id: req.body.id
      }
    }).then(() => {
    res.status(200).send("update food diary item response");
  }).catch(err => {
    console.log(JSON.stringify(err));
    res.status(500).send("error updating food diary item")
  });

};

exports.addFoodsToDiary = (req, res) => {
  let foodItemsToAdd = [];
  req.body.foodDiaryData.forEach((foodDiaryItem) => {
    foodItemsToAdd.push({
      meal: foodDiaryItem.meal,
      date: Utils.parseDate(foodDiaryItem.date),
      userId: req.userId,
      foodId: foodDiaryItem.foodId,
      servings: foodDiaryItem.servings ? foodDiaryItem.servings : 1
    })
  });
  FoodDiaryItem.bulkCreate( foodItemsToAdd
  ).then(() => {
    res.status(200).send("success adding foods (to be implemented)");
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });

};
