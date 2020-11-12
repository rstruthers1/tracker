import React, {useState, useEffect} from "react";
import RecipeService from "../services/recipe.service";
import FoodDiaryUtils from "../utils/food.diary.utils";
import {mealTypes} from "../utils/tracker.constants";

const Recipes = (props) => {
  
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    RecipeService.getRecipes().then(
      (response) => {
        console.log(JSON.stringify(response.data));
        setRecipes(response.data);
      },
      (error) => {
        alert(error.toString());
      });
  }, []);
  
  return (
    <div className="container">
      <h1>Recipes</h1>
      {
        recipes ? (
          <div>
            {
              recipes.map((row) => (
                <div key={row.id}>
                  <h2>{row.name}</h2>
                  <img src={row.imageUrl} className='recipeImg'/>
                </div>
              )) 
            }
          </div>
        ) :
          (
            <div>No recipes</div>
          )
      }
    </div>
  )
};

export default Recipes;
