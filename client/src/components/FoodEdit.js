import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState, useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import _ from "lodash/fp";
import Select from "react-select";
import FoodService from "../services/food.service";
import MeasurementService from "../services/measurement-unit";

const FoodEdit = (props) => {
  const { register, handleSubmit, reset, errors, control } = useForm();
  const [measurementOptions, setMeasurementOptions] = useState([]);

  const resetMeasurementOptions = (m) => {
    let newMeasurementOptions = [];
    if (!m) {
      setMeasurementOptions([]);
      return;
    }
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
  

  let open = props.open;
  let handleCloseOk = props.handleCloseOk;
  let handleCloseCancel = props.handleCloseCancel;
  let food =  props.food ? {...props.food} : {};
  
  let grams = null;
  let numMeasurementUnits = null;

  useEffect(() => {
    
    console.log("FoodEdit, food: " + JSON.stringify(food, null, 2));
   
    grams = food.grams;
    if (grams && !isNaN(grams)) {
      food.grams = (Number(grams)).toFixed(3);
    }

    numMeasurementUnits = food.numMeasurementUnits;
    if (numMeasurementUnits && !isNaN(numMeasurementUnits)) {
      food.numMeasurementUnits = (Number(numMeasurementUnits)).toFixed(3);
    }

    let measurements = props.measurements ? [...props.measurements] : [];
    console.log("measurements: " + JSON.stringify(props.measurements));
    
    
    resetMeasurementOptions(measurements);
  }, [props]);


  /**
   * findMeasurementOption, value: 91
   FoodEdit.js:64 *** measurementOptions: [{"value":71,"label":"Servings","color":"#00B8D9","isFixed":true},{"value":81,"label":"Teaspoons","color":"#00B8D9","isFixed":true},{"value":91,"label":"Tablespoons","color":"#00B8D9","isFixed":true},{"value":101,"label":"Cups","color":"#00B8D9","isFixed":true},{"value":111,"label":"Pieces","color":"#00B8D9","isFixed":true},{"value":121,"label":"Ounces","color":"#00B8D9","isFixed":true},{"value":131,"label":"Pounds","color":"#00B8D9","isFixed":true},{"value":141,"label":"Grams","color":"#00B8D9","isFixed":true},{"value":151,"label":"Kilograms","color":"#00B8D9","isFixed":true},{"value":161,"label":"Fluid ounces","color":"#00B8D9","isFixed":true},{"value":171,"label":"Milliliters","color":"#00B8D9","isFixed":true},{"value":181,"label":"Liters","color":"#00B8D9","isFixed":true},{"value":191,"label":"Pints","color":"#00B8D9","isFixed":true},{"value":201,"label":"Quarts","color":"#00B8D9","isFixed":true},{"value":211,"label":"Gallons","color":"#00B8D9","isFixed":true},{"value":221,"label":"Milligrams","color":"#00B8D9","isFixed":true},{"value":231,"label":"Micrograms","color":"#00B8D9","isFixed":true},{"value":241,"label":"Grams","color":"#00B8D9","isFixed":true}]

   */
  const findMeasurementOption = (value) => {
    console.log("findMeasurementOption, value: " + JSON.stringify(value, null, 2));
    console.log("*** measurementOptions: " + JSON.stringify(measurementOptions));
    let foundOption = {};
    for (let i = 0; i < measurementOptions.length; i++) {
      let currentOption = measurementOptions[i];
      console.log("currentOption: " + JSON.stringify(currentOption, null, 2));
      if (currentOption.value == value) {
        foundOption = {...currentOption};
        break;
      }
    }
    console.log("foundOption: " + JSON.stringify(foundOption, null, 2));
    return foundOption;
  };


  const onSubmit = data => {
    console.log(JSON.stringify(data,null, 2));
    handleCloseOk(data);
  };

  return (open && (
    <Modal show={open} onHide={handleCloseCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Food Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} >
          <input type="hidden" name="id" defaultValue={food.id} ref={register()}/>
          <div className="form-group">
            <label className="control-label col-sm-12" htmlFor="description">Description</label>
            <div className="col-sm-12">
            <textarea name="description" className="form-control" rows="2"
                      ref={register({required: true, minLength: 3})}
                      defaultValue={food.description}></textarea>
              {_.get("description.type", errors) === "required" && (
                <p className="error">Description is required</p>
              )}
              {_.get("description.type", errors) === "minLength" && (
                <p className="error">Description must have at least 3 characters</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-12" htmlFor="servingSize">Serving Size</label>
            <div className="col-sm-12">
              <input name="servingSize" className="form-control" ref={register}
                     defaultValue={food.servingSize}/>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-12" htmlFor="servingSie">Serving Size</label>
            <div className="col-sm-12">
              <div className="form-row">

                <div className="col col-sm-3">
                  <input name="numMeasurementUnits" type="number" step=".001" ref={register({ min: 0, required: true })} 
                         defaultValue={food.numMeasurementUnits}
                         className="form-control" />
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
                    defaultValue={findMeasurementOption(food.measurementUnitId) || ""}
                  />
                  {_.get("measurementUnit.type", errors) === "required" && (
                    <p className="error">Serving Size Unit is required</p>
                  )}

                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-12" htmlFor="grams">Weight in Grams</label>
            <div className="col-sm-12">
              <input name="grams" ref={register} className="form-control" defaultValue={food.grams}
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
            <label className="control-label col-sm-12" htmlFor="calories" >Calories</label>
            <div className="col-sm-12">
              <input name="calories" type="number" ref={register({ min: 0, required: true })} className="form-control"
                     defaultValue={food.calories}/>
              {_.get("calories.type", errors) === "required" && (
                <p className="error">Calories is required</p>
              )}
              {_.get("calories.type", errors) === "min" && (
                <p className="error">Calories cannot be negative</p>
              )}
            </div>
          </div>

        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseCancel}>
          Close
        </Button>
        <Button variant="primary" onClick={event => handleSubmit(onSubmit)()}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  ))
};

export default FoodEdit;
