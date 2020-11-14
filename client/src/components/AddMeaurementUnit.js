import React, {useState, useEffect} from "react";
import { useForm} from "react-hook-form";
import _ from "lodash/fp";
import MeasurementService from "../services/measurement-unit"

const AddMeasurementUnit = (props) => {
  const {register, handleSubmit, errors, reset, control} = useForm();
  
  const onSubmit = data => {
    console.log(JSON.stringify(data));
    MeasurementService.addMeasurement(data).then(
      (response) => {
        alert("Posted successfully, response is: " + JSON.stringify(response.data));
        reset();
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    );
  };
  
  return (
    <div className="container">
      <h1>Add Measurement Unit</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="unit">Measurement Unit</label>
          <div className="col-sm-6">
            <input name="name" ref={register({required: true, minLength: 3})} className="form-control"/>
            {_.get("name.type", errors) === "required" && (
              <p className="error">Measurement Unit is required</p>
            )}
            {_.get("name.type", errors) === "minLength" && (
              <p className="error">Measurement Unit must have at least 3 characters</p>
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

export default AddMeasurementUnit;
