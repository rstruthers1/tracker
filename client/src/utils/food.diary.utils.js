const sumCalories = (items) => {
  if (!items) {
    return 0;
  }
  let sum = 0;
  items.forEach(item => {
    sum += item.calories;
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

export default {
  sumCalories,
  getMealItems,
  dateToQueryParamValue
}
