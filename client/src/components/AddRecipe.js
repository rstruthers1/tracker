import React, {useState, useEffect} from "react";
import { useForm} from "react-hook-form";
import useGlobal from "../store";
import {recipeCellWidths} from "../utils/tracker.constants";
import Table from 'react-bootstrap/Table';
import _ from "lodash/fp";
import AsyncCreatableSelect from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';
import FoodService from "../services/food.service";
import {v4 as uuidv4} from 'uuid';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Styles from './Styles';
import NewFoodFormModal from "./NewFoodFormModal";

const createOption = (label, recipeItemId) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
  recipeItemId: recipeItemId
});

const defaultOptions = [
  createOption('One', 1),
  createOption('Two', 2),
  createOption('Three', 3),
];


const AddRecipe = (props) => {
  const { register, handleSubmit, reset, errors, control } = useForm();
  const [globalState, globalActions] = useGlobal();
  const [recipeItems, setRecipeItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [showNewFoodModal, setShowFoodModal] = useState(false);
  const [foodModalDescription, setFoodModalDescription] = useState("");
  const [foodModalRecipeItemId, setFoodModalRecipeItemId] = useState(null);
  const [options, setOptions] = useState([]);
  //const [values, setValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const setNewValue = (newValue, recipeItemId, newFoodItem) => {
    // console.group("setNewValue");
    // let newValues = [];
    // for (let i = 0; i < values.length; i++) {
    //   let value = values[i];
    //   let valueCopy =  {...value};
    //   console.log("i: " + i + ", recipeItemId: " + recipeItemId);
    //   console.log("valueCopy.recipeItemId: " + valueCopy.recipeItemId);
    //   if (valueCopy.recipeItemId === recipeItemId) {
    //     console.log("Changing label and value to: " + JSON.stringify(newValue));
    //     valueCopy.label = newValue.label;
    //     valueCopy.value = newValue.value;
    //   }
    //   newValues.push(valueCopy);
    // }
    // setValues(newValues);
    // console.groupEnd();
    console.group("setNewValue");
    let newRecipeItems = [];
    // recipeItems.forEach(item => {
    //   let newItem = JSON.parse(JSON.stringify(item));
    //   newRecipeItems.push(newItem);
    // });
    
    for (let i = 0; i < recipeItems.length; i++) {
      let item = recipeItems[i];
      let newItem = {...item};
      let oldFoodItem = item.foodItem;
      newItem.food = oldFoodItem ? {...oldFoodItem} : {};
      let oldValue = item.value;
      newItem.value = oldValue ? {...oldValue} : {};
        console.log("i: " + i + ", recipeItemId: " + recipeItemId);
        console.log("newItem.recipeId: " + newItem.recipeItemId);
        console.log("newItem: " + JSON.stringify(newItem));
      if (newItem.recipeItemId === recipeItemId) {
        console.log("Changing label and value to: " + JSON.stringify(newValue));
        newItem.value = {
          label: newValue.label,
          value: newValue.value
        };
        newItem.foodItem = newFoodItem;
        newItem.calories = newFoodItem.calories;
        newItem.servings = newFoodItem.servings;
        console.log("newItem: " + JSON.stringify(newItem));
        
      }
      newRecipeItems.push(newItem);
    }
 
    // let newValues = [...values, {recipeItemId: newRecipeItemId}];
    //setValues(newValues);
   // console.log(JSON.stringify(newRecipeItems));
    setRecipeItems(newRecipeItems);
    console.groupEnd();
  };

  const handleChange = (newValue, actionMeta, recipeItemId) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setNewValue(newValue, recipeItemId);
  };
  
  const handleCreate = (inputValue, recipeItemId) => {
    setIsLoading(true);
    console.group('Option created');
    console.log('Wait a moment...');
    // setTimeout(() => {
    //   const newOption = createOption(inputValue, recipeItemId);
    //   console.log(newOption);
    //   console.groupEnd();
    //   setIsLoading(false);
    //   setFoodOptions([...foodOptions, newOption]);
    //   setNewValue(newOption, recipeItemId);
    // }, 1000);
    
    let foodItem = {
      description: inputValue,
      servingSize: "1 Tablespoon",
      calories: 20
    };
    FoodService.addFood(foodItem).then(
      (response) => {
        console.log("Posted successfully, response is: " + JSON.stringify(response.data));
        //addFoodItem(response.data);
        //fetchAllFoods();
        //handleRowFoodItemSelected(data.recipeItemId, response.data);
        let item = response.data;
        const newOption = { value: item.id,
            label: item.servingSize + " - " + item.description,
            color: '#00B8D9',
            isFixed: true };
        //createOption(inputValue, recipeItemId);
        console.log(newOption);
        setIsLoading(false);
        setFoodOptions([...foodOptions, newOption]);
        setNewValue(newOption, recipeItemId, item);
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
        setIsLoading(false);
      }
    );

  };
  
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
    //setOptions(defaultOptions);
    
    
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
    });
   // let newValues = [...values, {recipeItemId: newRecipeItemId}];
    //setValues(newValues);
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
          newItem.foodItem = {};
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

  const promiseOptions = (inputValue, callback) =>
    new Promise(resolve => {
      console.log("promiseOptions");
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
    setIsLoading(true);
    setFoodModalDescription(value);
    setFoodModalRecipeItemId(recipeItemId);
    setShowFoodModal(true);
  };


  
  const handleCloseNewFoodModal = () => {
    setIsLoading(false);
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
        // alert("Posted successfully, response is: " + JSON.stringify(response.data));
        //addFoodItem(response.data);
        fetchAllFoods();
       
        handleRowFoodItemSelected(data.recipeItemId, response.data);
        setIsLoading(false);
        
      },
      (error) => {
        console.log(JSON.stringify(error));
        alert(JSON.stringify(error));
        setIsLoading(false);
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
              {recipeItems && (recipeItems.map((row, index) => 
                (<tr key={row.recipeItemId}>
                  <td>
                    <input name={"servings-" + row.recipeItemId} type="number" step="0.001" min="0" ref={register({required: true})} className="form-control" 
                           defaultValue={row.servings}
                    onChange={event => handleServingsChanged(event, row.recipeItemId)}
                    onBlur={event => handleServingsOnBlur(event, row.recipeItemId)}/>
                  </td>
                  <td>
                    <CreatableSelect
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={(value, actionMetadata) => handleChange(value, actionMetadata, row.recipeItemId)}
                      onCreateOption={value => handleCreate(value, row.recipeItemId )}
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
                      handleSave={handleSaveNewFood}
                      description={foodModalDescription}
                      recipeItemId={foodModalRecipeItemId}
    />

    </div>
  );
};

export default AddRecipe;
