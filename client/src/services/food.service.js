import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/food";


const addFood = (brand, description) => {
  return axios.post(API_URL , {
    brand,
    description
  });
};


export default {
  addFood
};
