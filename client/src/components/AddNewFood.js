import React from "react";
import { useForm} from "react-hook-form";
import FoodService from "../services/food.service";


const AddNewFood = (props) => {
  const { register, reset, handleSubmit } = useForm();
  const onSubmit = data => {
    console.log(data);
    FoodService.addFood(data).then(
      (response) => {
          alert("Posted successfully, response is: " + JSON.stringify(response.data));
          reset()
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    );
  }

  return (

      <div className="container">

        <h1>Enter a New Food</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Description</label>
            <div className="col-sm-6">
          <textarea name="description" ref={register} className="form-control" rows="3"></textarea>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Serving Size</label>
            <div className="col-sm-6">
              <input name="servingSize" ref={register} className="form-control"/>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Calories</label>
            <div className="col-sm-6">
              <input name="calories" ref={register} className="form-control"/>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-6">
          <button type="submit" style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block">Submit</button>
            </div>
          </div>
        </form>

    </div>
  )
};

export default AddNewFood;
