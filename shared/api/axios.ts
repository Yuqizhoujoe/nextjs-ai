import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    "content-type": "application/json",
  },
});

export default instance;
