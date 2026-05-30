import { Store } from "@tanstack/store";
import { Platform } from "react-native";
import Purchases, { CustomerInfo, LOG_LEVEL } from "react-native-purchases";

const RC_API_KEY = process.env.EXPO_PUBLIC_RC_API_KEY ?? "";

export const ENTITLEMENT_ID = "premium";

// ─── store ───────────────────────────────────────────────
type PremiumState = { isPremium: boolean };

export const premiumStore = new Store<PremiumState>({ isPremium: false });

function setFromInfo(info: CustomerInfo) {
  console.log("[RC] activeEntitlements:", JSON.stringify(info.entitlements.active));
  const active = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  console.log("[RC] isPremium →", active);
  premiumStore.setState(() => ({ isPremium: active }));
}

export async function loginPurchases(userId: string) {
  if (Platform.OS === "web") return;
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    setFromInfo(customerInfo);
  } catch (e) { if (__DEV__) console.warn("[RC]", e); }
}

export async function logoutPurchases() {
  if (Platform.OS === "web") return;
  try {
    await Purchases.logOut();
    premiumStore.setState(() => ({ isPremium: false }));
  } catch (e) { if (__DEV__) console.warn("[RC]", e); }
}

export async function refreshPremium() {
  try {
    const info = await Purchases.getCustomerInfo();
    setFromInfo(info);
  } catch (e) { if (__DEV__) console.warn("[RC]", e); }
}

// ─── init ────────────────────────────────────────────────
export async function initPurchases() {
  if (Platform.OS === "web") return;

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.WARN : LOG_LEVEL.ERROR);
  if (__DEV__) {
    Purchases.setLogHandler((level, message) => {
      if (message.includes("workflows/default")) return;
      if (level === LOG_LEVEL.ERROR) console.warn("[RC]", message);
      else console.log("[RC]", message);
    });
  }
  Purchases.configure({
    apiKey: RC_API_KEY,
  });

  // текущий статус при старте
  try {
    const info = await Purchases.getCustomerInfo();
    setFromInfo(info);
  } catch (e) { if (__DEV__) console.warn("[RC]", e); }

  // автообновление после покупки / восстановления
  Purchases.addCustomerInfoUpdateListener(setFromInfo);
}
