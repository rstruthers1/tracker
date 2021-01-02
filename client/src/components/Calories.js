import React from "react";
import {fraction} from 'mathjs';
import convert from 'convert-units';

const convertUnitNameMaps = [
  {
    fullName: "Cup",
    convertUnitName: "cup"
  },
  {
    fullName: "Tablespoon",
    convertUnitName: "Tbs"
  },
  {
    fullName: "Teaspoon",
    convertUnitName: "tsp"
  }
];


const getConvertUnitName = unit => {
  for (let i = 0; i < convertUnitNameMaps.length; i++) {
    let map = convertUnitNameMaps[i];
    if (map.fullName === unit) {
      return map.convertUnitName;
    }
  }
  return null;
};

const Calories = (props) => {
  
  let amount = props.amount ? props.amount : "";
  let ingredient = props.ingredient ? props.ingredient : {};
  let unit = props.unit ? props.unit : {};
  
  const calcCalories = () => {
    if (!amount || !ingredient.value || ! unit.value) {
      console.log("Can't calc yet");
      return "Can't calc yet";
    }
    console.log("amount: " + amount);
    console.log("ingredient: " + JSON.stringify(ingredient));
    console.log("unit: " + JSON.stringify(unit));
    let calories = "?";
    try {
      if (!ingredient.volumeUnit) {
        return "ingredient is missing volumeUnit";
      }
      if (!unit.value) {
        return "unit is missing a value";
      }

      if (!ingredient.volumeAmount) {
        return "ingredient is missing volumeAmount";
      }
      if (!ingredient.calories && ingredient.calories !== 0) {
        return "ingredient is missing calories";
      }

      
      let fractionIngredientVolumeAmount = fraction(ingredient.volumeAmount);
      console.log("fractionIngredientVolumeAmount: " + fractionIngredientVolumeAmount.toFraction());

      let fractionAmount = fraction(amount);
      console.log("fractionAmount: " + fractionAmount.toFraction());
      
      let ingredientUnitVolumeAmount = fractionIngredientVolumeAmount.valueOf();
      let amountOfGivenUnit = fractionAmount.valueOf();
      
      if (unit.value === ingredient.volumeUnit) {
       
        
        calories = ingredient.calories * amountOfGivenUnit / ingredientUnitVolumeAmount;
        
        return calories.toFixed(0);
      } else {
        let unitConvertedName= getConvertUnitName(unit.value);
        if (!unitConvertedName) {
          return "Can't convert given unit";
        }
        console.log("unitConvertedName: " + unitConvertedName);
        let ingredientUnitConvertedName = getConvertUnitName(ingredient.volumeUnit);
        if (!ingredientUnitConvertedName) {
          return "Can't convert given ingredient unit";
        }
        console.log("ingredientUnitConvertedName: " + ingredientUnitConvertedName);
        console.log("amountOfGivenUnit: " + amountOfGivenUnit);
        
        calories = ingredient.calories * 
          convert(amountOfGivenUnit).from(unitConvertedName).to(ingredientUnitConvertedName) / ingredientUnitVolumeAmount;
        calories = calories.toFixed(0);
      }
    } catch (ex) {
      
      console.log("Error: " + ex);
      return JSON.stringify(ex);
    }
    return calories;
   
  };
  
  return (
    <input name="calories" className="form-control" disabled={true} value={calcCalories()}/>
  )
};

export default Calories;
