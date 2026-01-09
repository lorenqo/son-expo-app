import type { User } from '@/models/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Store } from '@tanstack/store'
import type {CookieManagerStatic} from "@react-native-cookies/cookies";
import {Platform} from "react-native";
import {logoutRequest} from "@/services/auth";
let CookieManager: CookieManagerStatic | null = null;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CookieManager = require("@react-native-cookies/cookies");
}

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
  await logoutRequest()
  if (Platform.OS !== "web" && CookieManager) {
    await CookieManager.clearAll(true)
  }

}

export async function syncUser(user: User) {
  authStore.setState({
    user,
    hydrated: true,
  })

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}
