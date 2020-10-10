import React, {useState, useEffect} from "react";
import { useForm} from "react-hook-form";
import RecipeService from "../services/recipe.service";
import useGlobal from "../store";
import {cellWidths} from "../utils/tracker.constants";
import Table from 'react-bootstrap/Table';
import _ from "lodash/fp";


const AddRecipe = (props) => {
  const { register, handleSubmit, reset, errors } = useForm();
  const [globalState, globalActions] = useGlobal();
  const [recipeItems, setRecipeItems] = useState([]);

  const onSubmit = data => {
    console.log(data);
    alert("post this data: " + JSON.stringify(data));
    // RecipeService.addRecipe(data).then(
    //   (response) => {
    //     alert("Posted successfully, response is: " + JSON.stringify(response.data));
    //     reset()
    //   },
    //   (error) => {
    //     console.log(JSON.stringify(error));
    //     alert(JSON.stringify(error));
    //   }
    // );
  };
  
  const handleAddRow = event => {
    event.preventDefault();
    alert("add row");
  };

  return (
    <div className="container">
      <div>
        Add Recipe
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="name">Recipe Name</label>
          <div className="col-sm-6">
            <input name="name" ref={register({required: true, minLength: 3})} className="form-control" rows="3"></input>
            {_.get("name.type", errors) === "required" && (
              <p className="error">Recipe Name is required</p>
            )}
            {_.get("name.type", errors) === "minLength" && (
              <p className="error">Recipe name must have at least 3 characters</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="servings">Servings</label>
          <div className="col-sm-6">
            <input name="servings" type="number" step="0.001" min="0" ref={register({required: true})} className="form-control"/>
            {_.get("servings.type", errors) === "required" && (
              <p className="error">Servings is required</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-8">
        <Table size="sm" >
          <thead>
      
            <tr>
              <th style={{width: cellWidths.DESCRIPTION, border: "hidden"}}>Ingredients</th>
              <th style={{width: cellWidths.SERVINGS, border: "hidden"}}></th>
              <th style={{width: cellWidths.CALORIES, border: "hidden"}}>
                <button style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block btn-secondary btn-sm"
                onClick={event => handleAddRow(event)}>
                  Add
                </button>
              </th>
            </tr>
       
          </thead>
        </Table>
          </div>
        </div>
        
        <div className="form-group" style={{paddingBottom: "20px"}}>
         
          <div className="col-sm-8">
            <Table size="sm">
              <thead>
              <tr>
              <th style={{width: cellWidths.DESCRIPTION}}>Description</th>
              <th style={{width: cellWidths.SERVINGS}}>Servings</th>
              <th style={{width: cellWidths.CALORIES}}>Calories</th>
              </tr>
              </thead>
            </Table>
          </div>
        </div>
        
        
        <div className="form-group">
          <div className="col-sm-2">
            <button type="submit" style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block">Submit</button>
          </div>
        </div>
       
      </form>

    </div>
  );
};

export default AddRecipe;
