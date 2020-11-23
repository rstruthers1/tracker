import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food/diary";


const getFoodDiary = (date) => {
  return axios.get(`/api/food/diary?date=${date}`,  { headers: authHeader() })
};

const addFoodsToDiary = (data) => {
  return axios.post("/api/food/diary", data, { headers: authHeader() })
};

const deleteFoodItemFromDiary = (foodDiaryItemId) => {
  return axios.delete(`/api/food/diary?id=${foodDiaryItemId}`, { headers: authHeader() })
};

const updateFoodDiaryItem = (data) => {
  return axios.put(`/api/food/diary`, data,{ headers: authHeader() })
};

export default {
  getFoodDiary,
  addFoodsToDiary,
  deleteFoodItemFromDiary,
  updateFoodDiaryItem
};
