import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food";

const addFood = (data) => {
  return axios.post(API_URL , data, { headers: authHeader() });
};

const getAllFoods = () => {
  return axios.get(API_URL , { headers: authHeader() });
};

const getFilteredFoods = (filter) => {
  return axios.get(`${API_URL}/filter/${filter}` , { headers: authHeader() });
};

const deleteFood = (foodId) => {
  return axios.delete(`/api/food/${foodId}`, { headers: authHeader() })
};

export default {
  addFood,
  getAllFoods,
  getFilteredFoods,
  deleteFood
};
