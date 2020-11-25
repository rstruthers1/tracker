import React, {useCallback, useState, useEffect} from "react";
import Select from 'react-select';
import { useForm} from "react-hook-form";
import FoodService from "../services/food.service";

const measurementList = [
  "Servings",
  "Teaspoons",
  "Tablespoons",
  "Cups",
  "Pieces",
  "Ounces",
  "Pounds",
  "Grams",
  "Kilograms",
  "Fluid ounces",
  "Milliliters",
  "Liters",
  "Pints",
  "Quarts",
  "Gallons",
  "Milligrams",
  "Micrograms",
  "Grams"
];

const AddNewFood = (props) => {
  const { register, reset, handleSubmit } = useForm();
  const [measurements, setMeasurements] = useState([]);
  const [measurementOptions, setMeasurementOptions] = useState([]);

  useEffect(() => {
    setMeasurements([...measurementList]);
    resetMeasurementOptions(measurementList);
  }, []);
  
  const resetMeasurementOptions = (m) => {
    let newMeasurementOptions = [];
    m.forEach(mItem => {
      newMeasurementOptions.push(
        { value: mItem,
          label: mItem,
          color: '#00B8D9',
          isFixed: true },
      )
    });
    setMeasurementOptions(newMeasurementOptions);
  };
  
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
  };
  
  

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
            <label className="control-label col-sm-6" htmlFor="servingSie">Serving Size</label>
            <div className="col-sm-6">
              <div className="form-row">
              
                <div className="col col-sm-3">
              <input className="form-control" />
                </div>
                <div className="col">
                  <Select name={"measurement"} options={measurementOptions}></Select>
                </div>
              </div>
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
