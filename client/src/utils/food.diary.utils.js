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
  if (servings) {
    return Number.parseFloat(servings).toFixed(2);
  } else {
    return servings;
  }
};

const parseDate = input => {

  let parts = input.split('-');

  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
};

export default {
  sumCalories,
  getMealItems,
  dateToQueryParamValue,
  formatServings,
  parseDate
}
