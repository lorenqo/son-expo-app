import axios, { AxiosHeaders } from "axios";
import { Platform } from "react-native";
import { getCookies, initCookies, saveCookiesFromResponse } from "./cookies";

const apiUrl =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_API_URL
    : process.env.EXPO_PUBLIC_MOBILE_API_URL;

const isWeb = Platform.OS === "web";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: isWeb,
});

// REQUEST
api.interceptors.request.use(async (config) => {
  await initCookies();
  const cookies = await getCookies();

  if (Platform.OS === "web") {
    return config;
  }

  // 📱 RN
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // затираем возможные куки okhttp
  config.headers.delete?.("Cookie");

  if (cookies) {
    config.headers.set("Cookie", cookies);
  }

  config.headers.set(
    "User-Agent",
    process.env.EXPO_PUBLIC_USER_AGENT ?? "DreamApp/1.0 ReactNative",
  );

  return config;
});

// RESPONSE
api.interceptors.response.use(
  async (response) => {
    const raw =
      response.headers["set-cookie"] || response.headers["Set-Cookie"];
    if (raw) {
      await saveCookiesFromResponse(response.headers);
    }
    return response;
  },
  (e) => Promise.reject(e),
);

export default api;
