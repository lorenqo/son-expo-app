import type { User } from '@/models/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Store } from '@tanstack/store'
import {Platform} from "react-native";
import {logoutRequest} from "@/services/requests";
import {removeCookies} from "@/services/cookies";

type AuthState = {
  user: User | null
  hydrated: boolean
}

const STORAGE_KEY = 'auth_user'

// 🟢 сам store
export const authStore = new Store<AuthState>({
  user: null,
  hydrated: false,
})

// 🔁 восстановление при старте
export async function hydrateAuth() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY)
    if (saved) {
      authStore.setState((s) => ({
        ...s,
        user: JSON.parse(saved),
        hydrated: true,
      }))
      return
    }
  } catch {}

  authStore.setState((s) => ({
    ...s,
    hydrated: true,
  }))
}

// ✅ логин
export async function login(user: User) {
  authStore.setState((s) => ({ ...s, user }))
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

// 🚪 логаут
export async function logout() {
  authStore.setState((s) => ({ ...s, user: null }))
  await AsyncStorage.removeItem(STORAGE_KEY)
  if (Platform.OS !== "web") {
    await removeCookies()
  } else
    document.cookie.split(";").forEach(c => {
      const name = c.split("=")[0].trim();
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.xander-le.work;`;
    });

  console.log('cookies deleted')


}

export async function syncUser(user: User) {
  authStore.setState({
    user,
    hydrated: true,
  })

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}
