const sumCalories = (items) => {
  if (!items) {
    return 0;
  }
  let sum = 0;
  items.forEach(item => {
    sum += (item.calories * item.servings);
  });
  return sum;
};

const getMealItems = (items, meal) => {
  let mealItems = [];
  if (!items) {
    return mealItems;
  }
  items.forEach(item => {
    if (item.meal === meal) {
      mealItems.push(item);
    }
  });
  return mealItems;
};

const dateToQueryParamValue = date => {
  if (!date) {
    return "";
  }
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

const formatServings = servings => {
  console.log("formatServings: " + servings);
  if (servings) {
    return Number.parseFloat(servings).toFixed(2);
  } else {
    return servings;
  }
};

export default {
  sumCalories,
  getMealItems,
  dateToQueryParamValue,
  formatServings
}
