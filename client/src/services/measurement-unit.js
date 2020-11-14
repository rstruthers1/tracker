import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/measurement";

const addMeasurement= (data) => {
  return axios.post(API_URL , data, { headers: authHeader() });
};

export default {
  addMeasurement
};
