import { Link, Redirect, SplashScreen, Tabs } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import { Pressable, Text } from "~/components/ui";
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from "~/components/ui/icons";
import { useAuth, useIsFirstTime } from "~/lib";

// 获取屏幕尺寸
const { width } = Dimensions.get("window");

// Tab样式自定义
const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: "4%",
    marginLeft: (width * 0.2), // 向左偏移自身宽度的一半以实现精确居中
    elevation: 4,
    borderRadius: 30,
    height: 60,
    // 主阴影 - 更加自然的柔和效果
    shadowColor: "rgba(63, 63, 83, 0.2)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    width: width * 0.6, // 宽度为屏幕的60%
    backgroundColor: "#FFFFFF",
    borderWidth: 0, // 确保没有边框
    borderTopWidth: 0, // 明确指定顶部没有边框
  },
  tabBarItemStyle: {
    height: 60,
  },
  container: {
    flex: 1,
  },
});

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== "idle") {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === "signOut") {
    return <Redirect href="/login" />;
  }
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarIcon: ({ color }) => <FeedIcon color={color} />,
            headerRight: () => <CreateNewPostLink />,
            tabBarButtonTestID: "feed-tab",
          }}
        />

        <Tabs.Screen
          name="style"
          options={{
            title: "Style",
            headerShown: false,
            tabBarIcon: ({ color }) => <StyleIcon color={color} />,
            tabBarButtonTestID: "style-tab",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
            tabBarButtonTestID: "settings-tab",
          }}
        />
      </Tabs>
    </View>
  );
}

function CreateNewPostLink() {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
}
