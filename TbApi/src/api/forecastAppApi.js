import axios from "axios";
import { config } from "../config/public.js";

// create axios instance
const instance = axios.create({
  baseURL: config.forecastAppUrl,
});

const getPredictedData = (formatedData) => {
  return instance.post(`/predict`, formatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default {
  getPredictedData,
};
