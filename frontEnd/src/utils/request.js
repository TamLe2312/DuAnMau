import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/",
});
export const deldete = async (path, option) => {
  const response = await request.post(path, option);
  return response.data;
};

export default request;
