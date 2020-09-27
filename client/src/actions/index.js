export const incrementFoodDiaryDate = (store) => {
  const foodDiaryDate = store.state.foodDiaryDate;
  foodDiaryDate.setDate(foodDiaryDate.getDate() + 1);
  store.setState({ foodDiaryDate  });
};

export const decrementFoodDiaryDate = (store) => {
  const foodDiaryDate = store.state.foodDiaryDate;
  foodDiaryDate.setDate(foodDiaryDate.getDate() - 1);
  store.setState({ foodDiaryDate  });
};
