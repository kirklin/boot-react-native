import type { ConfigContext, ExpoConfig } from "@expo/config";
import type { AppIconBadgeConfig } from "app-icon-badge/types";

import { ClientEnv, Env } from "./env";

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== "production",
  badges: [
    {
      text: Env.APP_ENV,
      type: "banner",
      color: "white",
    },
    {
      text: Env.VERSION.toString(),
      type: "ribbon",
      color: "white",
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: "boot-react-native",
  version: Env.VERSION.toString(),
  orientation: "portrait",
  icon: "./assets/icon-with-padding.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.BUNDLE_ID,
    config: {
      usesNonExemptEncryption: false, // Avoid the export compliance warning on the app store
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon-with-padding.png",
      backgroundColor: "#FFFFFF",
    },
    package: Env.PACKAGE,
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFFFFF",
        image: "./assets/icon.png",
        imageWidth: 150,
      },
    ],
    [
      "expo-font",
      {
        fonts: ["./assets/fonts/Inter.ttf"],
      },
    ],
    "expo-localization",
    "expo-router",
    ["app-icon-badge", appIconBadgeConfig],
    ["react-native-edge-to-edge"],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
