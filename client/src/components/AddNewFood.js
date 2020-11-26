import React, {useCallback, useState, useEffect} from "react";
import Select from 'react-select';
import { useForm, Controller} from "react-hook-form";
import FoodService from "../services/food.service";
import MeasurementService from "../services/measurement-unit";


const AddNewFood = (props) => {
  const { register, reset, handleSubmit, control } = useForm();
  const [measurements, setMeasurements] = useState([]);
  const [measurementOptions, setMeasurementOptions] = useState([]);

  const [foods, setFoods] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {

    MeasurementService.getAllMeasurements().then(
      (response) => {
        console.log("Got measurements");
        setMeasurements(response.data);
        resetMeasurementOptions(response.data);
      },
      (error) => {
        console.log("******ERROR: " + JSON.stringify(error.response));
        alert(JSON.stringify(error.response));
      });

    FoodService.getAllFoods().then(
      (response) => {
        console.log("Got foods");
        setFoods(response.data);
        resetFoodOptions(response.data);
      },
      (error) => {
        console.log("******ERROR: " + JSON.stringify(error.response));
        alert(JSON.stringify(error.response));
      });
    
    
  }, []);

  const resetFoodOptions = (f) => {
    let newOptions = [];
    f.forEach(item => {
      newOptions.push(
        { value: item.id,
          label: item.description,
          color: '#00B8D9',
          isFixed: true },
      )
    });
    setFoodOptions(newOptions);
  };
  
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
  
  const onSubmit = data => {
    console.log(data);
    alert(JSON.stringify(data));
    // FoodService.addFood(data).then(
    //   (response) => {
    //       alert("Posted successfully, response is: " + JSON.stringify(response.data));
    //       reset()
    //   },
    //   (error) => {
    //     console.log(JSON.stringify(error));
    //     alert(JSON.stringify(error));
    //   }
    // );
  };
  
  

  return (

      <div className="container">

        <h1>Enter a New Food Serving</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="description">Food</label>
            <div className="col-sm-6">
              <Controller
                name="food"
                as={Select}
                options={foodOptions}
                control={control}
                rules={{required: true}}
                />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-6" htmlFor="servingSie">Serving Size</label>
            <div className="col-sm-6">
              <div className="form-row">
              
                <div className="col col-sm-3">
                  <input name="numMeasurementUnits" ref={register} className="form-control" />
                </div>
                <div className="col">
                  <Controller
                    name="measurementUnit"
                    as={Select}
                    options={measurementOptions}
                    control={control}
                    rules={{required: true}}
                  />
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
