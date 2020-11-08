import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/image";

const uploadImage = (image) => {
  const formData = new FormData();
  formData.append(0, image);
  return axios.post(API_URL , formData, { headers: authHeader() });
};

export default {
  uploadImage
};
