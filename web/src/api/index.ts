import axios from "axios";
import {BASE_URL} from "@/api/constant.ts";

const axiosInstance = axios.create({
  baseURL: BASE_URL
});

export default axiosInstance;