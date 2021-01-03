import React, {useState, useEffect} from "react";

import {useForm} from "react-hook-form";

import Spinner from 'react-bootstrap/Spinner'

import _ from "lodash/fp";

import axios from "axios";

import useSWR from "swr";

import {v4 as uuidv4} from "uuid";

import Button from "react-bootstrap/Button";

import Select from "react-select";

import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import ReactQuill from 'react-quill';

import ImageService from "../services/image.service";
import Image from './Image'
import CaloriesConverter from "../utils/calories.converter.util";
import authHeader from "../services/auth-header";



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

const AddRecipe = (props) => {
  const {register, handleSubmit, errors} = useForm();

  const [picture, setPicture] = useState(null);
  const [isPictureLoading, setIsPictureLoading] = useState(false);

  //const [foodItems, setFoodItems] = useState([]);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [instructionsText, setInstructionsText] = useState({ text: '' } );
  const [foodItemSections, setFoodItemSections] = useState([
    {
      id: uuidv4(),
      name: "For the Dough",
      totalCalories: 0,
      foodItems: []
    },
    {
      id: uuidv4(),
      name: "For the Cinnamon Filling",
      totalCalories: 0,
      foodItems: []
    }
  ]);
  const { data:foods} = useSWR("/api/food", fetcher);


  const onSubmit = data => {
    console.log("picture: " + picture);
  };

  const onImageFileChange = e => {
    let file= e.target.files[0];
    let imageType = /image.*/;
    if (!file.type.match(imageType)) {
      alert("Wrong file type for image!");
      return;
    }
    setIsPictureLoading(true);
    ImageService.uploadImage(file).then(
      (response) => {
        console.log("Uploaded image successfully: " + JSON.stringify(response));
        setIsPictureLoading(false);
        setPicture(response.data);
      },
      (error) => {
        console.log("Error uploading image: " + JSON.stringify(error));
        alert("Error uploading image: " + JSON.stringify(error));
        setIsPictureLoading(false);
      }
    );
  };

  
  const removeImage = () => {
    setPicture(null);
  };

  const handleInstructionsTextChange = (value) => {
    console.log("*** handleInstructionsTextChange, value: " + value);
    setInstructionsText({text: value});
  };

  const onError = () => {
    
  };

  // useEffect(() => {
  //   populateFoodItemsWithOptionalUpdate("none",[]);
  // }, []);

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
    if (!items || !Array.isArray(items)) {
      return null;
    }
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

  const populateFoodItemsWithOptionalUpdate = (action, foodSection, payload) => {
    if (action === "update" || action === "delete" || action === "add") {
      setShouldShowPrompt(true);
    }
    let items = foodSection.foodItems;
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
    foodSection.foodItems = newFoodItems;
    foodSection.totalCalories = newTotalCalories;
    return foodSection;
  };
  
  const findFoodItemSection = (sectionId) => {
    return foodItemSections.find(section => 
      section.id === sectionId
    )
  };
  
  const updateFoodItemSection = (updatedFoodItemSection) => {
    let newFoodItemSections = [];
    // try shallow copy 

    let newTotalCalories = 0;
    for (let i = 0; i < foodItemSections.length; i++) {
      let foodItemSection = foodItemSections[i];
      if (foodItemSection.id === updatedFoodItemSection.sectionId) {
        newFoodItemSections.push(updatedFoodItemSection);
        newTotalCalories += updatedFoodItemSection.totalCalories;
      } else {
        newFoodItemSections.push(foodItemSection);
        newTotalCalories += foodItemSection.totalCalories;
      }
    }
    setFoodItemSections(newFoodItemSections);
    setTotalCalories(newTotalCalories);
  };
  
  const updateFoodItemInSection = (accessor, value, foodItemId, sectionId, payload) => {
    const originalFoodItemSection = findFoodItemSection(sectionId);
    let updatedFoodItemSection = populateFoodItemsWithOptionalUpdate(accessor, originalFoodItemSection, payload);
    updateFoodItemSection(updatedFoodItemSection);
  };

  const handleUpdateFoodItem = (accessor, value, foodItemId, sectionId) => {
    console.log("handleUpdateFoodItem, sectionId: " + sectionId);
    updateFoodItemInSection("update", value, foodItemId, sectionId, {foodItemId, accessor, value});
   
  };

  const handleAddFoodItem = (sectionId) => {
    console.log("handleAddFoodItem, sectionId: " + sectionId);
    updateFoodItemInSection("add", null, null, sectionId);
  };

  const handleDeleteFoodItem = (foodItemId, sectionId) => {
    console.log("handleDeleteFoodItem, sectionId: " + sectionId);
    updateFoodItemInSection("delete", null, foodItemId, sectionId, {foodItemId: foodItemId});
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
      props.onBlur(props.accessor, event.target.value.trim(), props.foodItemId, props.sectionId)
    };

    return (
      <input value={value}
             onChange={event => handleInputChanged(event)}
             onBlur={event => handleOnBlur(event)}
             className="form-control recipe-cell-input"
      />
    )
  };
  
  const handleUpdateSectionName = (name, sectionId) => {
    console.log("Update name for secection id " + sectionId + " to " + name);
    let foodItemSection = findFoodItemSection(sectionId);
    foodItemSection.name = name;
    updateFoodItemSection(foodItemSection);
  };
  

  const SectionNameInput = (props) => {
    const [value, setValue] = useState("");

    useEffect(() => {
      setValue(props.value)
    }, [props]);

    const handleInputChanged = (event) => {
      setValue(event.target.value);
    };

    const handleOnBlur = (event) => {
      props.onBlur(event.target.value.trim(), props.sectionId)
    };

    return (
      
      <input value={value}
             onChange={event => handleInputChanged(event)}
             onBlur={event => handleOnBlur(event)}
             className="recipe-section-name-input"
             placeholder="Optional: Ingredient Section Name"
      />
      
    )
  };
  
  const editableFoodGroupingSelectStyles = {
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
        minHeight: "32px",

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
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const  formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];
  
  return (
    <div className="container">
      <div>
        <h1>Add Recipe</h1>
      </div>

      
      <div className="form-group">

        <div className="form-group">
          <div className="col-sm-10">
            <h2>Basic Recipe Information</h2>
          </div>
        </div>
        
        <label className="control-label col-sm-6" htmlFor="name">Recipe Image</label>
        <div className="col-sm-6">
          { isPictureLoading ? (<span><Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner><div className="sr-only">Loading...</div></span>): (picture ? (
            <Image
              image={picture}
              removeImage={removeImage}
              onError={onError}
            />
          ) : (
            <div>
              <input type='file' id='single' onChange={event => onImageFileChange(event)} />
            </div>
          ))
          }
        </div>
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
              <input name="servings" type="number" step="0.001" min="0" ref={register({required: true})}
                     className="form-control"/>
              {_.get("servings.type", errors) === "required" && (
                <p className="error">Servings is required</p>
              )}
            </div>
          </div>

        <div className="form-group">
          <div className="col-sm-10">
            <h2>Ingredients</h2>
          </div>
        </div>
         
        {foodItemSections.map(foodItemSection => 
        <div className="form-group" >
          <div className="col-sm-10" >
            {foods ? (
            <div className="recipe-section-outline">
             
              <h3>
              <SectionNameInput  
                value = {foodItemSection.name}
                onBlur = {handleUpdateSectionName}
                sectionId = {foodItemSection.id}
              />
              </h3>
            
              <div className="recipe-add-ingredient-container">
                <Button onClick = {event => handleAddFoodItem(foodItemSection.id)} className="tracker-button">
                  Add Ingredient
                </Button>
              </div>

              <table className="recipe-section-table">
                <thead>
                  <tr>
                    <th className="recipe-section-table-cell-amount">Amount</th>
                    <th className="recipe-section-table-cell-unit">Unit</th>
                    <th className="recipe-section-table-cell-food">Food</th>
                    <th className="recipe-section-table-cell-comment">Comment</th>
                    <th className="recipe-section-table-cell-calories-th">Calories</th>
                    <th className="recipe-section-table-cell-delete-th">Delete</th>
                  </tr>
                </thead>

                <tbody>
                {
                  foodItemSection.foodItems && foodItemSection.foodItems.map(row => {
                    return (
                      <tr key={row.foodItemId}>
                        <td className="recipe-section-table-cell-amount">
                          <CellInput
                            value = {row.amount}
                            onBlur = {handleUpdateFoodItem}
                            accessor = "amount"
                            foodItemId = {row.foodItemId}
                            sectionId = {foodItemSection.id}
                          />
                          {
                            row.error && row.error.amount && <p className="input-error">{row.error.amount}</p>
                          }
                        </td>
                        <td className="recipe-section-table-cell-unit">
                          <Select
                            options = {row.food.allowedUnits}
                            onChange = {(value, actionMetadata) => handleUpdateFoodItem("unit", value, row.foodItemId, foodItemSection.id)}
                            value={row.unit}
                            styles={editableFoodGroupingSelectStyles}
                          />
                        </td>
                        <td className="recipe-section-table-cell-food">

                          <Select
                            options = {populateFoodOptions(foods)}
                            onChange = {(value, actionMetadata) => handleUpdateFoodItem("food", value, row.foodItemId, foodItemSection.id)}
                            value={row.food}
                            styles={editableFoodGroupingSelectStyles}
                          />

                        </td>
                        <td className="recipe-section-table-cell-comment">
                          <CellInput
                            value = {row.comment ? row.comment : ""}
                            onBlur = {handleUpdateFoodItem}
                            accessor = "comment"
                            foodItemId = {row.foodItemId}
                            sectionId = {foodItemSection.id}
                          />
                          {
                            row.error && row.error.amount && <p className="input-error">{row.error.comment}</p>
                          }
                        </td>
                        <td>
                          <div className="recipe-section-table-cell-calories-td">{row.calories}</div>
                        </td>
                        <td className="recipe-section-table-cell-delete-td">
                          <IconButton onClick={event=> {handleDeleteFoodItem(row.foodItemId, foodItemSection.id)}} 
                                      className="icon-button">
                            <DeleteForeverIcon/>
                          </IconButton>
                        </td>
                      </tr>
                    )
                  })}
                <tr><td className="recipe-section-table-cell-amount"></td>
                  <td className="recipe-section-table-cell-unit"></td>
                  <td className="recipe-section-table-cell-food"></td>
                  <td className="recipe-section-table-cell-comment-footer">Section Calories</td>
                  <td className="recipe-section-table-cell-calories-footer-fd">{foodItemSection.totalCalories}</td>
                  <td className="recipe-section-table-cell-delete-td"></td></tr>
                </tbody>
              </table>
              

            </div>

            ) : <div>Loading</div>}
           
           
          </div>
          
         
        </div>
        )}
        <div className="form-group">
          <div className="col-sm-10">
            <div className="recipe-section-outline">
              <table className="recipe-section-table">
                <tbody>
                <tr>
                  <td className="recipe-section-table-cell-amount"></td>
                  <td className="recipe-section-table-cell-unit"></td>
                  <td className="recipe-section-table-cell-food"></td>
                  <td className="recipe-section-table-cell-comment-footer">Recipe Calories</td>
                  <td className="recipe-section-table-cell-calories-footer-fd">{totalCalories}</td>
                  <td className="recipe-section-table-cell-delete-td"></td>
                </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-10">
            <h2>Instructions</h2>
            <ReactQuill value={instructionsText.text}
                        onChange={handleInstructionsTextChange}
                        modules={modules}
                        format={formats}/>
          </div>
        </div>
        
        <div className="form-group">
          <div className="col-sm-2">
            <button type="submit" className="btn btn-primary btn-block tracker-button">Submit</button>
          </div>
        </div>
       
      </form>
      

    </div>
  );
};

export default AddRecipe;
