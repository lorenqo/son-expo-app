import { Platform } from "react-native";
import type { CookieManagerStatic } from "@react-native-cookies/cookies";

const apiUrl =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_API_URL
    : process.env.EXPO_PUBLIC_MOBILE_API_URL;




let CookieManager: CookieManagerStatic | null = null;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CookieManager = require("@react-native-cookies/cookies");
}

export async function loginRequest(email: string, password: string) {
  const loginUrl = `${apiUrl}/rest/v1/auth/process?email=${encodeURIComponent(
    email
  )}&password=${encodeURIComponent(password)}`;

  const response = await fetch(loginUrl, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Host: "xander-le.work",
    },
  });

  if (Platform.OS !== "web" && CookieManager && apiUrl) {
    const cookies = await CookieManager.get(apiUrl);
    console.log("COOKIES ON LOGIN:", cookies);
  }

  const data = await response.json();
  return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("passwd", password);

  const response = await fetch(`${apiUrl}/rest/v1/users`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.content || "Ошибка регистрации");
  }

  return data;
}

export async function checkEmail(email: string) {
  const checkEmailUrl =
    `${apiUrl}/rest/v1/users?filter=check_exist_user` +
    `&email=${encodeURIComponent(email)}`;

  const response = await fetch(checkEmailUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка проверки email");
  }

  const data = await response.json();
  return Boolean(data);
}

export async function auth() {
  const checkAuth = `${apiUrl}/rest/v1/auth?referrer=${apiUrl}/`;

  const response = await fetch(checkAuth, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Host: "xander-le.work",
    },
  });

  // 2. Обработка ошибки сети или сервера
  if (!response.ok) {
    const errorData = await response.text();
    console.log("--- ОШИБКА AUTH ---", response.status, errorData);
    throw new Error(`Ошибка аутентификации: ${response.status}`);
  }

  if (Platform.OS !== "web" && CookieManager && apiUrl) {
    const cookies = await CookieManager.get(apiUrl);
    console.log("COOKIES ON AUTH:", cookies);
  }



  const data = await response.json();
  return data;
}

export async function logoutRequest() {
  const logoutApi = `${apiUrl}/rest/v1/auth/logout`;

 await fetch(logoutApi, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      Host: "xander-le.work",
    },
  });
}