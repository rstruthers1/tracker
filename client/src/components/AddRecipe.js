import React from "react";
import { useForm} from "react-hook-form";
import RecipeService from "../services/recipe.service";


const AddRecipe = (props) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = data => {
    console.log(data);
    alert("post this data: " + JSON.stringify(data));
    RecipeService.addRecipe(data).then(
      (response) => {
        alert("Posted successfully, response is: " + JSON.stringify(response.data));
        reset()
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    );
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
            <input name="name" ref={register} className="form-control" rows="3"></input>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="servings">Servings</label>
          <div className="col-sm-6">
            <input name="servings" ref={register} className="form-control"/>
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
