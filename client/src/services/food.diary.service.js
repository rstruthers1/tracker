import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food/diary";


const getFoodDiary = () => {
  return axios.get(API_URL, { headers: authHeader() });
};


export default {
  getFoodDiary
};
