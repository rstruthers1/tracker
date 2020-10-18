import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";
import {useForm} from "react-hook-form";
import _ from "lodash/fp";

const NewFoodFormModal = (props) => {
  const { register, handleSubmit, reset, errors, control } = useForm();

  let recipeItemId = props.data ? props.data.recipeItemId : "";
  let description = props.data ? props.data.description : "";
  let calories = props.data ? props.data.calories : 0;
  let servingSize = props.data ? props.data.servingSize : "";
  let show = props.show;
  let handleClose = props.handleClose;
  let handleSave = props.handleSave;
  
  const onSubmit = data => {
    console.log("onSubmit: " + data);
    handleSave(data);
  };
  
  return (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add Food Item</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit(onSubmit)} >
        <input type="hidden" name="recipeItemId" defaultValue={recipeItemId} ref={register()}/>
        <div className="form-group">
          <label className="control-label col-sm-12" htmlFor="description">Description</label>
          <div className="col-sm-12">
            <textarea name="description" className="form-control" rows="3"
                      ref={register({required: true, minLength: 3})}
                      defaultValue={description}></textarea>
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
            <input name="servingSize" className="form-control" ref={register({required: true, minLength: 3})}
               defaultValue={servingSize}/>
            {_.get("servingSize.type", errors) === "required" && (
              <p className="error">Serving size is required</p>
            )}
            {_.get("servingSize.type", errors) === "minLength" && (
              <p className="error">Serving size must have at least 3 characters</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-12" htmlFor="calories" >Calories</label>
          <div className="col-sm-12">
            <input name="calories" type="number" ref={register({ min: 0, required: true })} className="form-control"
            defaultValue={calories}/>
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
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={event => handleSubmit(onSubmit)()}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  )
};

export default NewFoodFormModal;
