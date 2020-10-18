import React, {useState, useEffect} from "react";
import { useForm} from "react-hook-form";
import {recipeCellWidths} from "../utils/tracker.constants";
import Table from 'react-bootstrap/Table';
import _ from "lodash/fp";
import CreatableSelect from 'react-select/creatable';
import FoodService from "../services/food.service";
import {v4 as uuidv4} from 'uuid';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Styles from './Styles';
import NewFoodFormModal from "./NewFoodFormModal";

const AddRecipe = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const classes = Styles.useStyles();
  
  const [recipeItems, setRecipeItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [showNewFoodModal, setShowFoodModal] = useState(false);
  const [foodModalData, setFoodModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const setFoodSelection = (selectedFoodOption, recipeItemId, selectedFood) => {

    console.group("setFoodSelection");
    let newRecipeItems = [];

    for (let i = 0; i < recipeItems.length; i++) {
      let recipeItem = recipeItems[i];
      let recipeItemCopy = JSON.parse(JSON.stringify(recipeItem));
     
      if (recipeItemCopy.recipeItemId === recipeItemId) {
        console.log("Changing label and value to: " + JSON.stringify(selectedFoodOption));
        recipeItemCopy.value = {
          label: selectedFoodOption.label,
          value: selectedFoodOption.value
        };
        if (selectedFood) {
          recipeItemCopy.foodItem = {...selectedFood};
          console.log("recalculating calories");
          console.log("recipeItemCopy.foodItem.calories: " + recipeItemCopy.foodItem.calories);
          console.log("recipeItemCopy.serving: " + recipeItemCopy.servings);
          recipeItemCopy.calories = recipeItemCopy.foodItem.calories * recipeItemCopy.servings;
        } else {
          recipeItemCopy.calories = 0;
          recipeItemCopy.foodItem = {}
        }
      }
      newRecipeItems.push(recipeItemCopy);
    }
    
    setRecipeItems(newRecipeItems);
    console.groupEnd();
  };

  const handleFoodChanged = (selectedFoodOption, actionMeta, recipeItemId) => {
    // the selectedFoodOption.value is the food id
    let foodItem = findFoodItem(selectedFoodOption.value);
    let newFoodItem = {...foodItem};
    setFoodSelection(selectedFoodOption, recipeItemId, newFoodItem);
  };
  
  const handleCreateNewFoodItem = (partialDescriptionInputValue, recipeItemId) => {
    setIsLoading(true);
    
    setFoodModalData({
      description: partialDescriptionInputValue,
      servingSize: "",
      calories: 0,
      recipeItemId: recipeItemId
    });
    setShowFoodModal(true);
  };

  const handleSaveNewFoodItem = (data) => {
    setShowFoodModal(false);

    let foodItemRequestPayload = {
      description: data.description,
      servingSize: data.servingSize,
      calories: data.calories
    };
    FoodService.addFood(foodItemRequestPayload).then(
      (response) => {
        console.log("Posted successfully, response is: " + JSON.stringify(response.data));
        let newFoodItem = response.data;
        const newFoodOption = { value: newFoodItem.id,
            label: newFoodItem.servingSize + " - " + newFoodItem.description,
            color: '#00B8D9',
            isFixed: true };
        setIsLoading(false);
        setFoodOptions([...foodOptions, newFoodOption]);
        addFoodItem(newFoodItem);
        setFoodSelection(newFoodOption, data.recipeItemId, newFoodItem);
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
        setIsLoading(false);
      }
    );
    
  };
  
  const onSubmit = data => {
    console.log(data);
    alert("post this data: " + JSON.stringify(data));
  };
  
  const fetchAllFoods = () => {
    FoodService.getAllFoods().then(
      (response) => {
        setFoodItems(response.data);
        resetFoodOptions(response.data);
        setIsLoading(false);
      },
      (error) => {
        alert(JSON.stringify(error));
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchAllFoods();
  }, []);
  
  const handleAddRow = event => {
    event.preventDefault();
    let newRecipeItems = [];
    recipeItems.forEach(item => {
      let newItem = JSON.parse(JSON.stringify(item));
      newRecipeItems.push(newItem);
    });
    let newRecipeItemId =  uuidv4();
    newRecipeItems.push({
      servings: 1,
      calories: 0,
      recipeItemId: newRecipeItemId,
      comment: "",
      foodItem: {}
    });
    setRecipeItems(newRecipeItems);
  };
  

  const handleRowServingsUpdate = (recipeItemId, servings) => {
    let newRecipeItems = [];
    recipeItems.forEach(item => {
      let newItem = JSON.parse(JSON.stringify(item));
      if (recipeItemId === newItem.recipeItemId) {
        newItem.servings = servings;
        if (newItem.foodItem) {
          newItem.calories = newItem.foodItem.calories * newItem.servings;
        } else {
          newItem.calories = 0;
        }
      }
      newRecipeItems.push(newItem);
    });
    setRecipeItems(newRecipeItems);
  };

  const deleteRecipeItemAction = (event, recipeItemId) => {
    let newRecipeItems = [];
    recipeItems.forEach(recipeItem => {
      if (recipeItem.recipeItemId !== recipeItemId) {
        let recipItemCopy = JSON.parse(JSON.stringify(recipeItem));
        newRecipeItems.push(recipItemCopy);
      }
    });
    setRecipeItems(newRecipeItems);
  };
  
  const resetFoodOptions = (foodItems) => {
    if (!foodItems) {
      setFoodOptions([]);
      return;
    }
    let newFoodOptions = [];
    foodItems.forEach(foodItem => {
      newFoodOptions.push(
        { value: foodItem.id, 
          label: foodItem.servingSize + " - " + foodItem.description, 
          color: '#00B8D9', 
          isFixed: true },
      )
    });
    setFoodOptions(newFoodOptions);
  };
  
  const findFoodItem = (foodId) => {
    for (let i = 0; i < foodItems.length; i++) {
      let foodItem = foodItems[i];
      if (foodId === foodItem.id) {
        return foodItem;
      }
    }
    return null;
  };
  
  const handleServingsOnBlur = (event, recipeItemId) => {
    handleRowServingsUpdate(recipeItemId, event.target.value);
  };
  
  
  const handleCloseNewFoodModal = () => {
    setIsLoading(false);
    setShowFoodModal(false);
  };

  const addFoodItem = newFoodItem => {
    let newFoodItems = [];
    foodItems.forEach(foodItem => {
      let newFoodItem = JSON.parse(JSON.stringify(foodItem));
      newFoodItems.push(newFoodItem);
    });
    newFoodItems.push(newFoodItem);
    setFoodItems(newFoodItems);
  };
  
  return (
    <div className="container">
      <div>
        Add Recipe
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="name">Recipe Name</label>
          <div className="col-sm-6">
            <input name="name" ref={register({required: true, minLength: 3})} className="form-control" rows="3"></input>
            {_.get("name.type", errors) === "required" && (
              <p className="error">Recipe Name is required</p>
            )}
            {_.get("name.type", errors) === "minLength" && (
              <p className="error">Recipe name must have at least 3 characters</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-6" htmlFor="servings">Servings</label>
          <div className="col-sm-6">
            <input name="servings" type="number" step="0.001" min="0" ref={register({required: true})} className="form-control"/>
            {_.get("servings.type", errors) === "required" && (
              <p className="error">Servings is required</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-10">
        <Table size="sm" >
          <thead>
      
            <tr>
              <th style={{width: recipeCellWidths.SERVINGS, border: "hidden"}}>Ingredients</th>
              <th style={{width: recipeCellWidths.DESCRIPTION, border: "hidden"}}></th>
              <th style={{width: recipeCellWidths.COMMENT, border: "hidden"}}></th>
              <th style={{width: recipeCellWidths.CALORIES, border: "hidden"}}></th>
              <th style={{width: recipeCellWidths.DELETE, border: "hidden"}}>
                <button style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block btn-secondary btn-sm"
                onClick={event => handleAddRow(event)}>
                  Add
                </button>
              </th>
            </tr>
       
          </thead>
        </Table>
          </div>
        </div>
        
        <div className="form-group" style={{paddingBottom: "20px"}}>
         
          <div className="col-sm-10">
            <Table size="sm">
              <thead>
              <tr>
                <th style={{width: recipeCellWidths.SERVINGS}}>Servings</th>
                <th style={{width: recipeCellWidths.DESCRIPTION}}>Description</th>
                <th style={{width: recipeCellWidths.COMMENT}}>Comment</th>
                <th style={{width: recipeCellWidths.CALORIES}}>Calories</th>
                <th style={{width: recipeCellWidths.DELETE}}>Delete</th>
              </tr>
              </thead>
              <tbody>
              {recipeItems && (recipeItems.map((row, index) => 
                (<tr key={row.recipeItemId}>
                  <td>
                    <input name={"servings-" + row.recipeItemId} type="number" step="0.001" min="0" ref={register({required: true})} className="form-control" 
                           defaultValue={row.servings}
                    onBlur={event => handleServingsOnBlur(event, row.recipeItemId)}/>
                  </td>
                  <td>
                    <CreatableSelect
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={(value, actionMetadata) => handleFoodChanged(value, actionMetadata, row.recipeItemId)}
                      onCreateOption={value => handleCreateNewFoodItem(value, row.recipeItemId )}
                      options={foodOptions}
                      value={row.value}
                    />
                  </td>
                  <td>
                    <textarea name={"comment-" + row.recipeItemId}  ref={register({required: true})} className="form-control"
                           defaultValue={row.comment} rows="1"></textarea>
                  </td>
                  <td style={{textAlign: "right"}}>
                    <span>{row.calories}</span>
                  </td>
                  <td style={{textAlign: "right"}}>
                    <Tooltip title="Delete entry">
                      <IconButton
                        aria-label="delete"
                        className={classes.iconButton}
                        id={row.id}
                        onClick={event => deleteRecipeItemAction(event, row.recipeItemId)}
                      >
                        <DeleteIcon/>
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>)
              )) }
              </tbody>
            </Table>
          </div>
        </div>
        
        
        <div className="form-group">
          <div className="col-sm-2">
            <button type="submit" style={{backgroundColor: '#00548F'}} className="btn btn-primary btn-block">Submit</button>
          </div>
        </div>
       
      </form>
    <NewFoodFormModal show={showNewFoodModal} 
                      handleClose={handleCloseNewFoodModal}
                      handleSave={handleSaveNewFoodItem}
                      data={foodModalData}
    />

    </div>
  );
};

export default AddRecipe;
