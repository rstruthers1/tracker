import React, {useState, useEffect} from "react";
import Select from 'react-select';
import { useForm, Controller} from "react-hook-form";
import _ from "lodash/fp";

import FoodService from "../services/food.service";
import MeasurementService from "../services/measurement-unit";



const AddNewFood = (props) => {
  const { register, handleSubmit, control, errors } = useForm();
  const [measurements, setMeasurements] = useState([]);
  const [measurementOptions, setMeasurementOptions] = useState([]);

 

  useEffect(() => {

   
    
  }, []);

    
  const resetMeasurementOptions = (m) => {
    let newMeasurementOptions = [];
    m.forEach(mItem => {
      newMeasurementOptions.push(
        { value: mItem.id,
          label: mItem.name,
          color: '#00B8D9',
          isFixed: true },
      )
    });
    setMeasurementOptions(newMeasurementOptions);
  };


/*
  {
    "description": "Butter",
    "numMeasurementUnits": "1",
    "grams": "227",
    "calories": "1627",
    "measurementUnit": {
    "value": 101,
      "label": "Cups",
      "color": "#00B8D9",
      "isFixed": true
    }
  }
  
  */

  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2));
    let food = {
      description: data.description,
      numMeasurementUnits: data.numMeasurementUnits,
      grams: data.grams,
      calories: data.calories,
      measurementUnitId: data.measurementUnit.value
    };
    console.log(JSON.stringify(food));
    FoodService.addFood(food).then(
      (response) => {
          alert("Posted successfully, response is: " + JSON.stringify(response.data));
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    );
  };
  
  

  return (

      <div className="container">

        <h1>Enter a New Food</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Food Description</label>
            <div className="col-sm-6">
              <input name="description" ref={register({required: true, minLength: 3})} className="form-control"/>
              {_.get("description.type", errors) === "required" && (
                <p className="error">Description is required</p>
              )}
              {_.get("description.type", errors) === "minLength" && (
                <p className="error">Description must have at least 3 characters</p>
              )}
              </div>
            </div>

         

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="servingSie">Serving Size</label>
            <div className="col-sm-6">
              <div className="form-row">
               
                <div className="col col-sm-3">
                  <input name="numMeasurementUnits" type="number" step=".001" ref={register({ min: 0, required: true })} className="form-control" />
                  {_.get("numMeasurementUnits.type", errors) === "required" && (
                    <p className="error">Serving Size is required</p>
                  )}
                  {_.get("numMeasurementUnits.type", errors) === "min" && (
                    <p className="error">Serving Size cannot be negative</p>
                  )}
                  
            </div>
                <div className="col">
                  <Controller
                    name="measurementUnit"
                    as={Select}
                    options={measurementOptions}
                    control={control}
                    rules={{required: true}}
                  />
                  {_.get("measurementUnit.type", errors) === "required" && (
                    <p className="error">Serving Size Unit is required</p>
                  )}
                  
              </div>
            </div>
              </div>
            </div>

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="grams">Weight in Grams</label>
            <div className="col-sm-6">
              <input name="grams" className="form-control" 
                     type="number" step=".001" ref={register({ min: 0, required: true })}/>
              {_.get("grams.type", errors) === "required" && (
                <p className="error">Weight in Grams is required</p>
              )}
              {_.get("grams.type", errors) === "min" && (
                <p className="error">Weight in Grams cannot be negative</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Calories</label>
            <div className="col-sm-6">
              <input name="calories" className="form-control"
                     type="number"  ref={register({ min: 0, required: true })}/>
              {_.get("calories.type", errors) === "required" && (
                <p className="error">Calories is required</p>
              )}
              {_.get("calories.type", errors) === "min" && (
                <p className="error">Calories cannot be negative</p>
              )}
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
