import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useState, useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import _ from "lodash/fp";
import Select from "react-select";

const FoodEdit = (props) => {
  const { register, handleSubmit, reset, errors, control } = useForm();

  let open = props.open;
  let handleCloseOk = props.handleCloseOk;
  let handleCloseCancel = props.handleCloseCancel;
  let food =  props.food ? {...props.food} : {};
  let grams = null;

  useEffect(() => {
    
    console.log("FoodEdit, food: " + JSON.stringify(food, null, 2));
   
    grams = food.grams;
    if (grams && !isNaN(grams)) {
      food.grams = (Number(grams)).toFixed(3);
    }
    
  }, [props]);

  
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
