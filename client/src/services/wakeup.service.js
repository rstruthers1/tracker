import axios from "axios";

const API_URL = "/api/wakeup";

const isServerAwake = () => {
 
  return axios.get(API_URL);
};

export default {
  isServerAwake
};
