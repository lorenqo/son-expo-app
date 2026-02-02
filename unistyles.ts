import { StyleSheet } from "react-native-unistyles";

const dreamLight = {
  colors: {
    background: "#F7F5F8",
    foreground: "#FFFFFF",

    typography: "#0F172A",
    dimmed: "#64748B",

    tint: "#A60DF2",
    activeTint: "#A60DF2",
    link: "#A60DF2",

    surface: "#FFFFFF",
    surfaceAlt: "#F1EEF4",
    nav: "#FFFFFF",
    border: "#E5E7EB",
    overlay: "rgba(15, 23, 42, 0.06)",

    // ДОБАВЛЕНО
    surfaceTranslucent: "rgba(255,255,255,0.6)",

    danger: "#DC2626",
    dangerBg: "#FEF2F2",

    accents: {
      primary: "#A60DF2",
      secondary: "#B790CB",
      grape: "#6D28D9",
      plum: "#7C3AED",
      orchid: "#C084FC",
    },
  },

  // ДОБАВЛЕНО
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 999,
  },

  shadows: {
    neon: {
      shadowColor: "#A60DF2",
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 0 },
      elevation: 8,
    },
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },

  gap: (v: number) => v * 8,
} as const;

const dreamDark = {
  colors: {
    background: "#1C1022",
    foreground: "#2A1B32",

    typography: "#FFFFFF",
    dimmed: "#B790CB",

    tint: "#A60DF2",
    activeTint: "#A60DF2",
    link: "#A60DF2",

    surface: "#2A1B32",
    surfaceAlt: "#24152B",
    nav: "#120A16",
    border: "rgba(255,255,255,0.08)",
    overlay: "rgba(255,255,255,0.10)",

    // ДОБАВЛЕНО
    surfaceTranslucent: "rgba(255,255,255,0.05)",

    danger: "#F87171",
    dangerBg: "rgba(127,29,29,0.20)",

    accents: {
      primary: "#A60DF2",
      secondary: "#B790CB",
      grape: "#8B5CF6",
      plum: "#C084FC",
      orchid: "#E9D5FF",
    },
  },

  // ДОБАВЛЕНО
  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 999,
  },

  shadows: {
    neon: {
      shadowColor: "#A60DF2",
      shadowOpacity: 0.6,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 0 },
      elevation: 10,
    },
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
  },

  gap: (v: number) => v * 8,
} as const;

const appThemes = {
  light: dreamLight,
  dark: dreamDark,
};

const breakpoints = { xs: 0, sm: 300, md: 500, lg: 800, xl: 1200 };

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    initialTheme: "dark",
  },
  themes: appThemes,
  breakpoints,
});
