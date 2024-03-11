import axios from "axios";

export const api = axios.create({
  baseURL: "https://teletech24-admin-verfication.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});