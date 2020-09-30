import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food";


const addFood = (data) => {
  return axios.post(API_URL , data, { headers: authHeader() });
};

const getAllFoods = () => {
  return axios.get(API_URL , { headers: authHeader() });
};

const addFoodsToDiary = (data) => {
  return axios.post("/api/food/diary", data, { headers: authHeader() })
};

const getFoodDiary = (date) => {
  return axios.get(`/api/food/diary?date=${date}`,  { headers: authHeader() })
};

const deleteFoodItemFromDiary = (foodDiaryItemId) => {
  return axios.delete(`/api/food/diary?id=${foodDiaryItemId}`, { headers: authHeader() })
};


export default {
  addFood,
  getAllFoods,
  addFoodsToDiary,
  getFoodDiary,
  deleteFoodItemFromDiary
};
