const db = require("../models");
const Food = db.food;
const FoodDiaryItem = db.foodDiaryItem;
const { QueryTypes } = require('sequelize');

const Op = db.Sequelize.Op;

exports.foodDiary = (req, res) => {
  console.log("food.diary.controller");
  db.sequelize.query("SELECT fdi.id, fdi.meal, fdi.date, " +
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
    res.status(500).send("deleting food items")
  });
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

exports.getAllFoods = (req, res) => {
  console.log("**** getAllFoods");
  Food.findAll({
    order: [['description', 'ASC']]
  }).then(foods => {
    console.log(JSON.stringify(foods));
    res.status(200).send(foods);
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });
};

exports.addFoodsToDiary = (req, res) => {
  console.log("*** addFoodsToDiary");
  console.log(JSON.stringify(req.body));
  console.log(req.body.foodIds);
  console.log("User id: " + req.userId);
  let foodItemsToAdd = [];
  req.body.foodIds.forEach((id) => {
    foodItemsToAdd.push({
      meal: req.body.meal,
      date: new Date(req.body.foodDiaryDate),
      userId: req.userId,
      foodId: id
    })
  });
  FoodDiaryItem.bulkCreate( foodItemsToAdd
  ).then(() => {

    res.status(200).send("success adding foods (to be implemented)");
  }).catch(err => {
    res.status(500).send("error getting all the foods")
  });

};
