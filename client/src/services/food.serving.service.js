import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food/serving";

const addFoodServing = (data) => {
  return axios.post(API_URL , data, { headers: authHeader() });
};


export default {
  addFoodServing
};
