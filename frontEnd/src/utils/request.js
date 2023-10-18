import axios from "axios";
import { APP_WEB } from "./config";

const request = axios.create({
  baseURL: APP_WEB,
});

export const deldete = async (path, option) => {
  const response = await request.post(
    `${request.defaults.baseURL}${path}`,
    option
  );
  return response.data;
};
export const post = async (path, option) => {
  const response = await request.post(
    `${request.defaults.baseURL}${path}`,
    option
  );
  return response;
};
export const get = async (path, option) => {
  const response = await request.get(
    `${request.defaults.baseURL}${path}`,
    option
  );
  return response;
};

export default request;
