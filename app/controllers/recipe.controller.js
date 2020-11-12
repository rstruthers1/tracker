const db = require("../models");
const Recipe = db.recipe;
const RecipeItem = db.recipeItem;
const Image = db.image;
const { QueryTypes } = require('sequelize');

const Op = db.Sequelize.Op;

exports.addRecipe = (req, res) => {
  console.log("addRecipe");
  console.log(JSON.stringify(req.body));
  Recipe.create(
    {
      name: req.body.name,
      servings: req.body.servings,
      imageId: req.body.imageId,
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

exports.getRecipes = (req, res) => {
  console.log("getRecipes");
  
  db.sequelize.query("select r.id, r.name, r.servings, r.imageId, \n" +
    "       i.fileName as imageFileName,\n" +
    "        i.url as imageUrl\n" +
    "from recipes r\n" +
    "left outer join images i on r.imageId = i.id " 
      // `and r.id = ${req.userId}`
    , {type: QueryTypes.SELECT}).then(recipes => {
    console.log(JSON.stringify(recipes));
    res.status(200).send(recipes);
  }).catch(err => {
    console.log(JSON.stringify(err));
    res.status(500).send("error getting all the recipes")
  });
};
