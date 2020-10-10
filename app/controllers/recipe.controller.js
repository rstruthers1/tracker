const db = require("../models");
const Recipe = db.recipe;
const { QueryTypes } = require('sequelize');

const Op = db.Sequelize.Op;

exports.addRecipe = (req, res) => {
  console.log("addRecipe");
  console.log(JSON.stringify(req.body));
  // Recipe.create(
  //   {
  //     name: req.body.name,
  //     servings: req.body.servings,
  //     userId: req.userId,
  //   }
  // ).then(recipe => {
  //   res.status(200).send(recipe);
  // }).catch( err => {
  //   res.status(500).send({ message: err.message });
  // });
  res.status(200).send("not implemented yet");

};
