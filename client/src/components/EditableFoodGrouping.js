import React, {useState, useEffect, useMemo, } from "react";
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import { Prompt } from 'react-router';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import {v4 as uuidv4} from 'uuid';

import CaloriesConverter from '../utils/calories.converter.util'
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import authHeader from "../services/auth-header";
import useSWR from "swr";



const unitCookingVolume = [
  ...(CaloriesConverter.getCookingUnitsByMeasure("volume"))
];

const unitCookingWeight = [
  ...(CaloriesConverter.getCookingUnitsByMeasure("mass"))
];

const servingUnit = {

  "abbr": "Serving",
  "measure": "volume",
  "system": "imperial",
  "singular": "Serving",
  "plural": "Serving",
  "label": "Serving",
  "value": "Serving"

};

const allCookingUnits = [
  ...unitCookingVolume, ...unitCookingWeight
];


const genericFoodItem = {
    foodItemId: "0",
    amount: "1",
    unit: {
      ...servingUnit
    },
    food: {
      label: "",
      value: "Generic",
      volumeUnit: "Serving",
      volumeAmount: "1",
      defaultUnit: "Serving",
      grams: 0,
      calories: 0,
    allowedUnits: [...allCookingUnits]
    },
  
};

const fetcher = (url) => axios.get(url, { headers: authHeader() }).
then((res) => {

    console.log("*** fetcher - Fetched data: ")
    return res.data;
  },
  (error) => {
    console.log("****** fetcher - ERROR: " + JSON.stringify(error.response));
    return error.response;
  }
);

const EditableFoodGrouping = (props) => {
  const [foodItems, setFoodItems] = useState([]);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [totalCalories, setTotalCalories] = useState("");
  const { data:foods} = useSWR("/api/food", fetcher);
  
  useEffect(() => {
    populateFoodItemsWithOptionalUpdate("none",[]);
  }, []);
  
  const getAllowedUnitOptionsForFood = foodItem => {
    return allCookingUnits.filter(unit => {
      return (foodItem.grams && unit.measure === "mass") ||  
        (foodItem.volumeUnit && foodItem.volumeAmount && unit.measure === "volume") ||
        ((foodItem.defaultUnit === "Serving" || !foodItem.defaultUnit) && unit.abbr === "Serving")
    }).map(unit => {
      return {...unit, value: unit.abbr, label: unit.singular}
    })
  };
  
  const populateFoodOptions = (items) => {
    let options = items.map(item => {
      return {...item, value: item.id, label: item.description, allowedUnits: getAllowedUnitOptionsForFood(item)}
    });
    return options;
  };
  
  const copyFoodItem = (foodItem) => {
    let newFoodItem = {
      foodItemId: foodItem.foodItemId,
      amount: foodItem.amount,
      unit: {...(foodItem.unit)},
      food: {...(foodItem.food)},
      comment: foodItem.comment
    };
    return newFoodItem;
  };
  
  const copyFoodItemWithUpdate = (foodItem, accessor, value) => {
    return {
      foodItemId: foodItem.foodItemId,
      amount: (accessor === "amount") ? value : foodItem.amount,
      unit: (accessor === "unit") ? {...value} : {...(foodItem.unit)},
      food: (accessor === "food") ? {...value} : {...(foodItem.food)},
      comment: (accessor === "comment") ? value : foodItem.comment
    }
  };
  
  const validateFoodItem = (foodItem) => {
    let error = {};
    error.amount = CaloriesConverter.validateAmount(foodItem.amount);
    return error;
  };

  const findUnit = (unit, unitList) => {
    if (!unitList || !unit) {
      return null;
    }
    for (let i = 0; i < unitList.length; i++) {
      let currentUnit = unitList[i];
      if (currentUnit.value === unit.value) {
        return currentUnit;
      }
    }
    return null;
  };
  
  const createNewFoodItem = () => {
    let newFoodItem = copyFoodItem(genericFoodItem);
    newFoodItem.foodItemId =  uuidv4();
    newFoodItem.error = {};
    return newFoodItem;
  };
  
  const findUnitOption = (abbr) => {
    return allCookingUnits.find(unit => unit.abbr === abbr)
  };
  
  const populateFoodItemsWithOptionalUpdate = (action, items, payload) => {
    if (action === "update" || action === "delete" || action === "add") {
      setShouldShowPrompt(true);
    }
   
    let newFoodItems = [];
    let newTotalCalories = 0;
    for (let i = 0; i < items.length; i++) {
      let foodItem = items[i];
      let newFoodItem = null;
      if ( (action === "update" || action === "delete") && (payload.foodItemId === foodItem.foodItemId)) {
        if (action === "delete") {
          continue;
        }
       
        newFoodItem = copyFoodItemWithUpdate(foodItem, payload.accessor, payload.value);
     
        if (!findUnit(newFoodItem.unit, newFoodItem.food.allowedUnits)) {
          newFoodItem.unit = findUnitOption(newFoodItem.food.defaultUnit);
          if (!newFoodItem.unit) {
            newFoodItem.unit = newFoodItem.food.allowedUnits.length > 0 ? newFoodItem.food.allowedUnits[0] : {};
          }
        }
      } else {
        newFoodItem = copyFoodItem(foodItem);
      }
      if (newFoodItem.food.value === "Generic") {
        newFoodItem.calories = "";
      } else {
        newFoodItem.calories = CaloriesConverter.calcCalories(newFoodItem.amount, newFoodItem.unit, newFoodItem.food);
        if (isNaN(newFoodItem.calories)) {
          console.log("error calculation calories: " + newFoodItem.calories);
          newFoodItem.calories = "";
        }
      }
      let newCalories = 0;
      try {
        newCalories = parseInt(newFoodItem.calories);
        if (isNaN(newCalories)) {
          newCalories = 0;
        }
      } catch (ex) {
        
      }
      newTotalCalories += newCalories;
      newFoodItem.error = validateFoodItem(newFoodItem);
      newFoodItems.push(newFoodItem);
    };
    if (action === "add") {
      newFoodItems.push(createNewFoodItem());
    }
    setFoodItems(newFoodItems);
    setTotalCalories(newTotalCalories);
  };
  
  const handleUpdateFoodItem = (accessor, value, foodItemId) => {
    populateFoodItemsWithOptionalUpdate("update", foodItems, {foodItemId, accessor, value});
  };

  const handleAddFoodItem = () => {
    populateFoodItemsWithOptionalUpdate("add", foodItems);
  };

  const handleDeleteFoodItem = (foodItemId) => {
    populateFoodItemsWithOptionalUpdate("delete", foodItems, {foodItemId: foodItemId})
  };
  
  const CellInput = (props) => {
      const [value, setValue] = useState("");
      
      useEffect(() => {
        setValue(props.value)
      }, [props]);
      
      const handleInputChanged = (event) => {
        setValue(event.target.value);  
      };
      
      const handleOnBlur = (event) => {
        props.onBlur(props.accessor, event.target.value.trim(), props.foodItemId)
      };
    
      return (
        <input value={value} 
               onChange={event => handleInputChanged(event)}
               onBlur={event => handleOnBlur(event)}
               className="form-control"
               style={{fontSize: "12px"}}
        />
      )
  };

  const reactSelectStyles = {
    singleValue: (provided, state) => ({
      ...provided,
      whiteSpace: "normal",
      fontSize: "12px",
      height: "22px",
      paddingBottom: "14px",
      paddingTop: "0px"
      
    }),
    menu: (provided, state) => (
      {
        ...provided,
        width: "100%",
        height: "30px",
        padding: "0px"
      }
    ),
    menuList: (provided, state) => (
      {
        ...provided,
        backgroundColor: "white"
      }
    ),
    control: (provided, state) => (
      {
        ...provided,
        height: "12px",
        padding: "2px",
        minHeight: "32px"
      }
    ),
    valueContainer: (provided, state) => (
      {
        ...provided,
        padding: "0px"
      }
    ),
    indicatorsContainer: (provided, state) => (
      {
        ...provided,
        height: "10px",
        padding: "2px",
        minHeight: "32px"
      }
    )
  };

  let unitWidth = "150px";
  let commentWidth = "200px";
  let foodWidth = "500px";
  
  return (
    <div>
      { props.header &&
      (<h1>Editable Food Grouping</h1>)
      }
      <div style={{marginBottom: "10px"}}>
      <Button onClick = {event => handleAddFoodItem()}>
        {
          props.addFoodItemLabel ?
            props.addFoodItemLabel : "Add Food Item"
        }
      </Button>
      </div>

      <table style={{maxWidth: "900px"}}>
        <thead>
          <tr><th style={{width: "100px"}}>Amount</th>
            <th style={{width: unitWidth}}>Unit</th>
            <th style={{width: foodWidth }}>Food</th>
            <th style={{width: commentWidth}}>Comment</th>
            <th style={{width: "100px"}}>Calories</th>
            <th>Delete</th></tr>
        </thead>
  
        <tbody>
        {
          foodItems && foodItems.map(row => {
            return (
              <tr key={row.foodItemId}>
                <td style={{verticalAlign: "top", width: "100px"}}>   
                  <CellInput
                  value = {row.amount}
                  onBlur = {handleUpdateFoodItem}
                  accessor = "amount"
                  foodItemId = {row.foodItemId}
                  />
                  {
                    row.error && row.error.amount && <p style={{fontSize: "12px", fontWeight: "bold", color: "red"}}>{row.error.amount}</p>
                  }
                </td>
                <td style={{verticalAlign: "top", width: unitWidth}}>
                 
                    <Select
                      options = {row.food.allowedUnits}
                      onChange = {(value, actionMetadata) => handleUpdateFoodItem("unit", value, row.foodItemId)}
                      value={row.unit}
                      styles={reactSelectStyles}
                      
                    />
                </td>
                <td style={{verticalAlign: "top", width: foodWidth }} >
               
                    <Select
                      options = {populateFoodOptions(foods)}
                      onChange = {(value, actionMetadata) => handleUpdateFoodItem("food", value, row.foodItemId)}
                      value={row.food}
                      styles={reactSelectStyles}
                      onMouseOver={event => {console.log("hover!")}}
                     
                    />
                
                </td>
                <td style={{verticalAlign: "top", width: commentWidth}}>
                  <CellInput
                    value = {row.comment ? row.comment : ""}
                    onBlur = {handleUpdateFoodItem}
                    accessor = "comment"
                    foodItemId = {row.foodItemId}
                  />
                  {
                    row.error && row.error.amount && <p style={{fontSize: "12px", fontWeight: "bold", color: "red"}}>{row.error.comment}</p>
                  }
                </td>
                <td>
                  <div style={{ textAlign: "right", width: "100px", fontSize: "12px", paddingRight: "30px"}}>{row.calories}</div>
                </td>
                <td style={{ width: "100px" }}>
                  <IconButton onClick={event=> {handleDeleteFoodItem(row.foodItemId)}} style = {{padding: "0px"}}>
                    <DeleteForeverIcon/>
                  </IconButton>
                </td>
              </tr>
            )
          })}
        <tr><td style={{width: "100px"}}></td>
          <td style={{width: unitWidth}}></td>
          <td style={{width: foodWidth }}></td>
          <td style={{width: commentWidth, fontWeight: "bold", textAlign: "right", fontSize: "12px", height: "32px", paddingTop: "10px"}}>Total Calories</td>
          <td style={{width: "100px", textAlign: "right", fontSize: "12px", paddingRight: "30px", height: "32px", paddingTop: "10px"}}>{totalCalories}</td>
          <td></td></tr>
        </tbody>
      </table>
     
      <Prompt when={shouldShowPrompt} message="You have unsaved changes, are you sure you want to leave?"/>
     
    </div>

  )
};

export default EditableFoodGrouping;
