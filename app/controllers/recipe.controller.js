const db = require("../models");
const Recipe = db.recipe;
const RecipeItem = db.recipeItem;
const { QueryTypes } = require('sequelize');

const Op = db.Sequelize.Op;

exports.addRecipe = (req, res) => {
  console.log("addRecipe");
  console.log(JSON.stringify(req.body));
  Recipe.create(
    {
      name: req.body.name,
      servings: req.body.servings,
      userId: req.userId,
    }
  ).then(recipe => {
    if (req.body.recipeItems) {
      let recipeItemsToAdd = [];
      req.body.recipeItems.forEach((recipeItem) => {
        recipeItemsToAdd.push({
          foodId: recipeItem.foodItemId,
          servings: recipeItem.servings,
          comments: recipeItem.comments,
          recipeId: recipe.id
        })
      });
      RecipeItem.bulkCreate(recipeItemsToAdd).then(() => {
        res.status(200).send(recipe);
      }).catch(err => {
        res.status(500).send("Error adding recipe items to recipe");
      })
    } 
    else {
      res.status(200).send(recipe);
    }
  }).catch( err => {
    res.status(500).send({ message: err.message });
  });
};
