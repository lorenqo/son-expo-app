import api from './api';
import {logCookies} from "@/services/cookies";
import {Platform} from "react-native";

const apiUrl =
    Platform.OS === "web"
        ? process.env.EXPO_PUBLIC_WEB_API_URL
        : process.env.EXPO_PUBLIC_MOBILE_API_URL;

// requests
export async function auth() {
    try {
        const response = await api.get('/rest/v1/auth', {
            params: { referrer: api.defaults.baseURL + '/' },
        });
        await logCookies()
        return response.data;
    } catch (error) {
        console.error('Auth error', error);
        throw error;
    }
}

// login
export async function loginRequest(email: string, password: string) {
    try {
        const response = await api.get('/rest/v1/auth/process', {
            params: {
                email,
                password,
            },
        });
        await logCookies()

        return response.data;
    } catch (error) {
        console.error('Login error', error);
        throw error;
    }
}

// register
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

// check email
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

// logout
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