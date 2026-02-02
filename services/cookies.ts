import AsyncStorage from "@react-native-async-storage/async-storage";

const COOKIE_KEY = "@my_cookies";

let cookieCache: string | null = null;
let initPromise: Promise<void> | null = null;

export function initCookies() {
  if (!initPromise) {
    initPromise = (async () => {
      cookieCache = await AsyncStorage.getItem(COOKIE_KEY);
    })();
  }
  return initPromise;
}

export async function logCookies() {
  await initCookies();
  console.log("ALL COOKIES:", cookieCache);
}

function parseStoredCookies(cookieString: string): Record<string, string> {
  const result: Record<string, string> = {};
  cookieString.split("; ").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx === -1) return;
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    result[key] = value;
  });
  return result;
}

function extractCookiePairsFromSetCookie(
  raw: string[],
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const line of raw) {
    const parts = line.split(/,(?=\s*[^=\s]+=[^;]+)/g);

    for (const part of parts) {
      const first = part.split(";")[0];
      const idx = first.indexOf("=");
      if (idx === -1) continue;

      const name = first.slice(0, idx).trim();
      const value = first.slice(idx + 1).trim();
      if (!name) continue;

      out[name] = value;
    }
  }

  return out;
}

export async function saveCookiesFromResponse(headers: any) {
  const raw = headers["set-cookie"] || headers["Set-Cookie"];
  if (!raw) return;

  const arr: string[] = Array.isArray(raw) ? raw : [String(raw)];

  await initCookies();

  const current = cookieCache ? parseStoredCookies(cookieCache) : {};
  const added = extractCookiePairsFromSetCookie(arr);

  Object.assign(current, added);

  cookieCache = Object.entries(current)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  await AsyncStorage.setItem(COOKIE_KEY, cookieCache);

  console.log("✅ STORED COOKIES:", cookieCache);
}

export async function getCookies(): Promise<string | null> {
  await initCookies();
  return cookieCache;
}

export async function removeCookies() {
  cookieCache = null;
  initPromise = null;
  await AsyncStorage.removeItem(COOKIE_KEY);
  console.log("Cookies removed");
}
