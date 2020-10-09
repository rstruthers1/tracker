import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/recipe";

const addRecipe = (data) => {
  return axios.post(API_URL , data, { headers: authHeader() });
};

export default {
  addRecipe
};
