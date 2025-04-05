import { Link, Redirect, SplashScreen, Tabs } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Pressable, Text } from "~/components/ui";
import { BubbleTabBar } from "~/components/ui/bubble-tab-bar";
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from "~/components/ui/icons";
import { useAuth, useIsFirstTime } from "~/lib";

// 自定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// 自定义颜色配置示例
const customColors = {
  index: {
    activeColor: "#5B37B7",
    activeBgColor: "rgba(223,215,243,1)",
    inactiveBgColor: "rgba(223,215,243,0)",
  },
  style: {
    activeColor: "#1194AA",
    activeBgColor: "rgba(207,235,239,1)",
    inactiveBgColor: "rgba(207,235,239,0)",
  },
  settings: {
    activeColor: "#E6A919",
    activeBgColor: "rgba(251,239,211,1)",
    inactiveBgColor: "rgba(251,239,211,0)",
  },
  default: {
    activeColor: "#2196F3",
    activeBgColor: "rgba(33,150,243,0.2)",
    inactiveBgColor: "rgba(33,150,243,0)",
  },
};

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
          headerShown: true,
          tabBarShowLabel: false,
        }}
        tabBar={props => (
          <BubbleTabBar
            {...props}
            colorMapping={customColors}
            // 也可以传入完整的自定义tabs配置
            // tabs={{
            //   index: {
            //     label: "首页",
            //     icon: FeedIcon,
            //     activeColor: "#FF5722",
            //     activeBgColor: "rgba(255,87,34,0.2)",
            //     inactiveBgColor: "rgba(255,87,34,0)"
            //   },
            //   // 其他标签...
            // }}
          />
        )}
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
