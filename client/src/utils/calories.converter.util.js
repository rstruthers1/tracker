import {fraction} from 'mathjs';
import convert from 'convert-units';

const cookingUnits =
  [
    {

      "abbr": "Serving",
      "measure": "volume",
      "system": "imperial",
      "singular": "Serving",
      "plural": "Serving"
    },
    {
      "abbr": "ml",
      "measure": "volume",
      "system": "metric",
      "singular": "Millilitre",
      "plural": "Millilitres"
    },
    {
      "abbr": "l",
      "measure": "volume",
      "system": "metric",
      "singular": "Litre",
      "plural": "Litres"
    },
    
    {
      "abbr": "tsp",
      "measure": "volume",
      "system": "imperial",
      "singular": "Teaspoon",
      "plural": "Teaspoons",
      "tags": ["dry"]
    },
    {
      "abbr": "Tbs",
      "measure": "volume",
      "system": "imperial",
      "singular": "Tablespoon",
      "plural": "Tablespoons",
      "tags": ["dry"]
    },
    {
      "abbr": "fl-oz",
      "measure": "volume",
      "system": "imperial",
      "singular": "Fluid Ounce",
      "plural": "Fluid Ounces",
    },
    {
      "abbr": "cup",
      "measure": "volume",
      "system": "imperial",
      "singular": "Cup",
      "plural": "Cups",
      "tags": ["dry"]
    },
    {
      "abbr": "pnt",
      "measure": "volume",
      "system": "imperial",
      "singular": "Pint",
      "plural": "Pints",
  
    },
    {
      "abbr": "qt",
      "measure": "volume",
      "system": "imperial",
      "singular": "Quart",
      "plural": "Quarts"
    },
    {
      "abbr": "gal",
      "measure": "volume",
      "system": "imperial",
      "singular": "Gallon",
      "plural": "Gallons"
    },
    {
      "abbr": "g",
      "measure": "mass",
      "system": "metric",
      "singular": "Gram",
      "plural": "Grams"
    },
    {
      "abbr": "kg",
      "measure": "mass",
      "system": "metric",
      "singular": "Kilogram",
      "plural": "Kilograms"
    },
    {
      "abbr": "oz",
      "measure": "mass",
      "system": "imperial",
      "singular": "Ounce",
      "plural": "Ounces"
    },
    {
      "abbr": "lb",
      "measure": "mass",
      "system": "imperial",
      "singular": "Pound",
      "plural": "Pounds"
    }
  ];


const getUnitAbbr = unit => {
  for (let i = 0; i < cookingUnits.length; i++) {
    let map = cookingUnits[i];
    if ( map.abbr === unit || map.singular === unit || map.plural === unit) {
      return map.abbr;
    }
  }
  return null;
};

const calcCalories = (amount, unit, ingredient) => {
  try {
    if (amount) {
      amount = amount.trim();
    }

    if (!amount || !ingredient) {
      return "Can't calc yet";
    }

    let decimalAmount = fraction(amount).valueOf();

    if (unit.abbr === 'Serving') {
      return ingredient.calories * decimalAmount;
    }

    let ingredientDecimalAmount = null;
    let ingredientUnit = null;

    if (unit.measure === "mass") {
      ingredientDecimalAmount = ingredient.grams;
      ingredientUnit = "g";
    } else {
      ingredientDecimalAmount = fraction(ingredient.volumeAmount).valueOf();
      ingredientUnit = getUnitAbbr(ingredient.volumeUnit);
    }

    if (!ingredientUnit) {
      return "Ingredient does not have a valid unit";
    }

    let calories = ingredient.calories *
      convert(decimalAmount).from(unit.abbr).to(ingredientUnit) / ingredientDecimalAmount;
    return calories.toFixed(0);
  } catch (ex) {
    return ex.toString();
  }
};

const calcCaloriesOld = (amount, unit, ingredient) => {
  if (amount) {
    amount = amount.trim();
  }
  if (!amount || !ingredient || !unit.abbr) {
    return "Can't calc yet";
  }

  let calories = "?";
  try {
   
    if (!unit.value) {
      return "unit is missing a value";
    }
    // if (!ingredient.volumeAmount) {
    //   return "ingredient is missing volumeAmount";
    // }
    if (!ingredient.calories && ingredient.calories !== 0) {
      return "ingredient is missing calories";
    }

    let fractionAmount = fraction(amount);
    let amountOfGivenUnit = fractionAmount.valueOf();
    let unitConvertedName = getUnitAbbr(unit.value);
    if (!unitConvertedName) {
      return "Can't convert given unit";
    }
    
    if (!ingredient.volumeUnit) {
      if (!ingredient.grams) {
        if (unit.value === "Serving") {
          return amountOfGivenUnit * ingredient.calories;
        }
        return "ingredient must have volume unit or grams";
      }
      calories = ingredient.calories *
        convert(amountOfGivenUnit).from(unitConvertedName).to("g") / ingredient.grams;
      calories = calories.toFixed(0);
      return calories;
    }
    let fractionIngredientVolumeAmount = fraction(ingredient.volumeAmount);
    let ingredientUnitVolumeAmount = fractionIngredientVolumeAmount.valueOf();
    
    if (unit.value === ingredient.volumeUnit) {
      calories = ingredient.calories * amountOfGivenUnit / ingredientUnitVolumeAmount;
      return calories.toFixed(0);
    } else {
      
      let ingredientUnitConvertedName = null;
      if (unit.measure === "mass") {
        calories = ingredient.calories *
          convert(amountOfGivenUnit).from(unitConvertedName).to("g") / ingredient.grams;
        calories = calories.toFixed(0);
        return calories;
      }
      
      ingredientUnitConvertedName = getUnitAbbr(ingredient.volumeUnit);
      if (!ingredientUnitConvertedName) {
        return "Can't convert given ingredient unit";
      }

      calories = ingredient.calories *
        convert(amountOfGivenUnit).from(unitConvertedName).to(ingredientUnitConvertedName) / ingredientUnitVolumeAmount;
      calories = calories.toFixed(0);
    }
  } catch (ex) {
    console.log("Error: " + ex);
    return ex.toString();
  }
  return calories;

};

const validateAmount = (amount) => {
  if (!amount) {
    return "Amount cannot be blank";
  }
  amount = amount.trim();
  try {
    fraction(amount);
  } catch (ex) {
    return "Invalid amount";
  }
  return null;
};

const listMeasurements = (typeOfUnit) => {
  if (typeOfUnit) {
    return convert(typeOfUnit).list(typeOfUnit);
  }
  return convert().list();
};

const getCookingUnits = () => {
  return cookingUnits.map(unit => ({...unit}))
};


const getCookingVolumeOptions = (tag) => {
  return cookingUnits
    .filter(unit => {
    return !tag || (unit.tags && unit.tags.includes(tag))
  })
    .map(unit => 
      ({...unit,  label: unit.singular, value: unit.abbr}));
};

const getCookingUnitOptionsByMeasure = (measure) => {
  return cookingUnits
    .filter(unit => {
      return unit.measure === measure
    })
    .map(unit =>
      ({...unit,  label: unit.singular, value: unit.abbr}));
};


export default {
  calcCalories,
  validateAmount,
  listMeasurements,
  getCookingUnits,
  getCookingVolumeOptions,
  getCookingUnitsByMeasure: getCookingUnitOptionsByMeasure
};
