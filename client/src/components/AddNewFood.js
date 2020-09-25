import React, {useEffect, useState, useRef} from "react";
import { useForm } from "react-hook-form";



import FoodService from "../services/food.service";
import AuthService from "../services/auth.service";




const AddNewFood = (props) => {


  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    console.log(data);

    FoodService.addFood(data).then(
      (response) => {
          alert("Posted successfully, response is: " + JSON.stringify(response.data))
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

      }
    );

  }

  return (

      <div className="container">
        <div className="col-md-8">
        <h1>Enter a New Food</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Description</label>
            <div className="col-sm-6">
          <input name="description" ref={register} className="form-control"/>
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
          <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </div>
          </div>
        </form>
        </div>
    </div>
  )
};

export default AddNewFood;
