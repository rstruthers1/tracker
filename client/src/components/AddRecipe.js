import React, {useState, useEffect} from "react";
import { useForm} from "react-hook-form";
import useGlobal from "../store";
import {recipeCellWidths} from "../utils/tracker.constants";
import Table from 'react-bootstrap/Table';
import _ from "lodash/fp";
import AsyncCreatableSelect from 'react-select/async-creatable';
import FoodService from "../services/food.service";
import {v4 as uuidv4} from 'uuid';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Styles from './Styles';
import NewFoodFormModal from "./NewFoodFormModal";


const AddRecipe = (props) => {
  const { register, handleSubmit, reset, errors, control } = useForm();
  const [globalState, globalActions] = useGlobal();
  const [recipeItems, setRecipeItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [showNewFoodModal, setShowFoodModal] = useState(false);
  const [foodModalDescription, setFoodModalDescription] = useState("");
  const [foodModalRecipeItemId, setFoodModalRecipeItemId,] = useState(null);
 
  
  const classes = Styles.useStyles();
  
  const onSubmit = data => {
    console.log(data);
    alert("post this data: " + JSON.stringify(data));
    // RecipeService.addRecipe(data).then(
    //   (response) => {
    //     alert("Posted successfully, response is: " + JSON.stringify(response.data));
    //     reset()
    //   },
    //   (error) => {
    //     console.log(JSON.stringify(error));
    //     alert(JSON.stringify(error));
    //   }
    // );
  };
  
  const fetchAllFoods = () => {
    FoodService.getAllFoods().then(
      (response) => {
        setFoodItems(response.data);
        resetFoodOptions(response.data);
      },
      (error) => {
        alert(JSON.stringify(error));
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
      let newItem = {...item};
      newRecipeItems.push(newItem);
    });
    newRecipeItems.push({
      servings: 1,
      calories: 0,
      recipeItemId: uuidv4(),
      foodItem: null,
      comment: ""
    });
    console.log(JSON.stringify(newRecipeItems));
    setRecipeItems(newRecipeItems);
  };
  
  const handleRowFoodItemSelected = (recipeItemId, foodItem) => {
    let newRecipeItems = [];
    recipeItems.forEach(item => {
      let newItem = {...item};
      if (recipeItemId === newItem.recipeItemId) {
        if (foodItem) {
          newItem.foodItem = {...foodItem};
          newItem.calories = foodItem.calories * newItem.servings;
        } else {
          newItem.foodItem = null;
        }
      }
      newRecipeItems.push(newItem);
    });
    setRecipeItems(newRecipeItems);
  };

  const handleRowServingsUpdate = (recipeItemId, servings) => {
    let newRecipeItems = [];
    recipeItems.forEach(item => {
      let newItem = {...item};
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
    recipeItems.forEach(item => {
      if (item.recipeItemId !== recipeItemId) {
        let newItem = {...item};
        newRecipeItems.push(newItem);
      }
    });
    setRecipeItems(newRecipeItems);
  };

  const filterFoodOptions = (inputValue) => {
    return foodOptions.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };
  
  const resetFoodOptions = (foodItems) => {
    if (!foodItems) {
      setFoodItems([]);
      return;
    }
    let newFoodOptions = [];
    foodItems.forEach(item => {
      newFoodOptions.push(
        { value: item.id, 
          label: item.servingSize + " - " + item.description, 
          color: '#00B8D9', 
          isFixed: true },
      )
    });
    setFoodOptions(newFoodOptions);
  };

  const promiseOptions = inputValue =>
    new Promise(resolve => {
      FoodService.getAllFoods().then(
        (response) => {
          setFoodItems(response.data);
          resetFoodOptions(response.data);
          resolve(filterFoodOptions(inputValue.toLowerCase()))
        },
        (error) => {
          alert(JSON.stringify(error));
        }
      );
    });
  
  const findFoodItem = (foodId) => {
    console.log("findFoodItem, foodId = " + foodId);
    for (let i = 0; i < foodItems.length; i++) {
      let foodItem = foodItems[i];
      if (foodId === foodItem.id) {
        return foodItem;
      }
    }
    return null;
  };
  
  const foodItemChanged = (event, recipeItemId) => {
    console.log("foodItemChanged, recipeItemId: " + recipeItemId + ", event: " + JSON.stringify(event));
    let foodItem = findFoodItem(event.value);
    handleRowFoodItemSelected(recipeItemId, foodItem);
    console.log("Food item: " + JSON.stringify(foodItem));
  };

  const handleServingsChanged = (event, recipeItemId) => {
    console.log("handleServingsChanged: " + recipeItemId + ", value: " + event.target.value);
  };
  
  const handleServingsOnBlur = (event, recipeItemId) => {
    console.log("handleServingsChanged: " + recipeItemId + ", value: " + event.target.value);
    handleRowServingsUpdate(recipeItemId, event.target.value);
  };
  
  const handleCreateFoodItem = (value, recipeItemId) => {
    console.log("Handle create item, recipeItemId = " + recipeItemId + 
      ", value = " + value);
    setFoodModalDescription(value);
    setFoodModalRecipeItemId(recipeItemId);
    setShowFoodModal(true);
  };


  
  const handleCloseNewFoodModal = () => {
    setShowFoodModal(false);
  };
  
  const addFoodItem = newFoodItem => {
    let newFoodItems = [];
    foodItems.forEach(foodItem => {
      newFoodItems.push(foodItem);
    });
    newFoodItems.push(newFoodItem);
    setFoodItems(newFoodItems);
    resetFoodOptions(foodItems);
  };
  
  const handleSaveNewFood = (data) => {
    
    setShowFoodModal(false);
    
    let foodItem = {
      description: data.description,
      servingSize: data.servingSize,
      calories: data.calories
    };
    FoodService.addFood(foodItem).then(
      (response) => {
        alert("Posted successfully, response is: " + JSON.stringify(response.data));
        addFoodItem(data);
        handleRowFoodItemSelected(data.recipeItemId, data);
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
      }
    );
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
              {recipeItems && (recipeItems.map(row => 
                (<tr key={row.recipeItemId}>
                  <td>
                    <input name={"servings-" + row.recipeItemId} type="number" step="0.001" min="0" ref={register({required: true})} className="form-control" 
                           defaultValue={row.servings}
                    onChange={event => handleServingsChanged(event, row.recipeItemId)}
                    onBlur={event => handleServingsOnBlur(event, row.recipeItemId)}/>
                  </td>
                  <td>
                    <AsyncCreatableSelect 
                      defaultOptions 
                      loadOptions={promiseOptions}
                      key={row.recipeItemId}        
                      onChange={event => {foodItemChanged(event, row.recipeItemId)}}
                      onCreateOption={value => handleCreateFoodItem(value, row.recipeItemId)}
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
                      handleSave={handleSaveNewFood}
                      description={foodModalDescription}
                      recipeItemId={foodModalRecipeItemId}
    />

    </div>
  );
};

export default AddRecipe;
