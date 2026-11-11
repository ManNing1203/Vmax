import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL =
  process.env.EXPO_PUBLIC_BACKEND_API_URL || process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const loggedInUser = await SecureStore.getItemAsync("loggedInUserData");

  if (loggedInUser) {
    const parsedUser = JSON.parse(loggedInUser);

    if (parsedUser?.token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = parsedUser.token;
    }
  }

  return config;
});

export default api;
