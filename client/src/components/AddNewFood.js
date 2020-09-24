import React, {useEffect, useState, useRef} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { useForm} from "react-hook-form";
import { isDecimal } from "validator";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';


import FoodService from "../services/food.service";


const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validateBrand = (value) => {
  if (value.length < 3 || value.length > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The brand/restaurant must be between 3 and 100 characters.
      </div>
    );
  }
};

const validateDescription = (value) => {
  if (value.length < 3 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The description must be between 3 and 200 characters.
      </div>
    );
  }
};

const validateServingSize = (value) => {
  if (value.length < 1 || value.length > 200) {
    return (
      <div className="alert alert-danger" role="alert">
        The serving size must be between 1 and 200 characters.
      </div>
    );
  }
};

const validateCalories = (value) => {
  if (!isDecimal(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Calories must be a number
      </div>
    )
  }
};

const AddNewFood = (props) => {

  const form = useRef();
  const checkBtn = useRef();

  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [calories, setCalories] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeBrand = (e) => {
    const brand = e.target.value;
    setBrand(brand);
  };

  const onChangeDescription = (e) => {
    const description = e.target.value;
    setDescription(description);
  };

  const onChangeServingSize = (e) => {
    const servingSize = e.target.value;
    setServingSize(servingSize);
  };

  const onChangeCalories = (e) => {
    const calories = e.target.value;
    setCalories(calories);
  };

  const handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setMessage("");
  //   setSuccessful(false);
  //   form.current.validateAll();
  //   console.log("Handle submit");
  // }

  const { control, handleSubmit } = useForm();
  const onSubmit = data => {
    alert(JSON.stringify(data));
  };



  return (
    <div className="col-md-8">
      <div className="container">

        <h1>Enter a New Food</h1>
        <Form className="form-horizontal" onSubmit={handleSubmit} ref={form}>
          {!successful && (
    <div>

              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="brand">Brand/Restaurant</label>
                <div className="col-sm-6">

                  <Input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={brand}
                    onChange={onChangeBrand}
                    validations={[required, validateBrand]}
                  />
                </div>
              </div>


              <div className="form-group">
                <label class="col-sm-2 col-form-label" htmlFor="description">Description</label>
                <div className="col-sm-6">
                  <Input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={description}
                    onChange={onChangeDescription}
                    validations={[required, validateDescription]}
                  />
                </div>
              </div>

      <div className="col-sm-6">
              <hr/>
      </div>


      <div className="form-group">
        <label className="col-sm-12 col-form-label" htmlFor="description">Serving Size</label>
      <div className="input-group col-sm-12">
        <Input type="text" className="form-control" value="0" style={{width: '50px'}}/>
        <span className="input-group-btn" style={{width: '0px'}}></span>
        <CreatableSelect options={options} className="col-sm-6"/>

      </div>
      </div>


      <div className="form-group">
        <label className="col-sm-6 col-form-label" htmlFor="description">Calories</label>
        <div className="col-sm-6">
          <Input
            type="text"
            className="form-control"
            name="calories"
            value={calories}
            onChange={onChangeCalories}
            validations={[required, validateCalories]}
          />
        </div>
      </div>


      <div className="form-group">
                <div className="col-sm-6">
                <button className="btn btn-primary btn-block">Submit</button>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={successful ? "alert alert-success" : "alert alert-danger"}
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{display: "none"}} ref={checkBtn}/>
        </Form>
      </div>
    </div>
  )
};

export default AddNewFood;
