import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { BottomTabDescriptor } from "@react-navigation/bottom-tabs/src/types";
import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors } from "~/components/ui/index";

// 添加一个简单的圆形图标作为默认备选
function CircleIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color,
      }}
    />
  );
}

// 获取屏幕尺寸
const { width } = Dimensions.get("window");

// 定义 TabBar 尺寸常量
const TAB_BAR_WIDTH = width * 0.6;
const TAB_BAR_PADDING = 8;
const AVAILABLE_WIDTH = TAB_BAR_WIDTH - (TAB_BAR_PADDING * 2);
const TAB_ITEM_BASE_WIDTH = 44;
// 调整最大项宽度，允许占用更多空间
const MAX_ITEM_WIDTH = AVAILABLE_WIDTH * 0.6;

// 文本宽度估算 - 增加每个字符的宽度估算
const CHAR_WIDTH_MULTIPLIER = 10;
// 添加额外的文本空间
const TEXT_PADDING = 8;

// 定义动画配置
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// 添加取消动画的常量，加快收缩速度
const CANCEL_SPRING_CONFIG = {
  damping: 25,
  stiffness: 400,
  mass: 0.4,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// 定义主题样式
const themes = {
  light: {
    tabBarBackground: "#FFFFFF",
    tabBarShadowColor: "rgba(63, 63, 83, 0.2)",
    inactiveIconColor: "#000000",
    // 添加默认颜色
    defaultActiveColor: colors.primary[500],
    defaultActiveBgColor: colors.primary[50],
    defaultInactiveBgColor: "rgba(223,215,243,0)",
  },
  dark: {
    tabBarBackground: "#1F1F1F",
    tabBarShadowColor: "rgba(0, 0, 0, 0.5)",
    inactiveIconColor: "#AAAAAA",
    // 添加默认颜色
    defaultActiveColor: colors.primary[500],
    defaultActiveBgColor: colors.primary[50],
    defaultInactiveBgColor: "rgba(223,215,243,0)",
  },
};

// 定义Tab类型
export interface TabItem {
  label: string;
  icon: React.ComponentType<{ color: string }>;
  activeColor: string;
  activeBgColor: string;
  inactiveBgColor: string;
}

export interface TabsConfig {
  [key: string]: TabItem;
}

// 移除defaultColors映射

// 定义样式
function createStyles(isDark: boolean) {
  return StyleSheet.create({
    tabBar: {
      position: "absolute",
      bottom: "4%",
      marginLeft: width * 0.2,
      elevation: 4,
      borderRadius: 30,
      height: 60,
      shadowColor: isDark ? themes.dark.tabBarShadowColor : themes.light.tabBarShadowColor,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      width: TAB_BAR_WIDTH,
      backgroundColor: isDark ? themes.dark.tabBarBackground : themes.light.tabBarBackground,
      borderWidth: 0,
      borderTopWidth: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      overflow: "hidden",
      padding: TAB_BAR_PADDING,
    },
    tabItemWrapper: {
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    tabItem: {
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      flexDirection: "row",
      paddingHorizontal: 12, // 增加水平内边距
      overflow: "hidden",
    },
    tabItemBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 22,
      zIndex: -1,
    },
    iconContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    tabItemLabel: {
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 8,
    },
    labelContainer: {
      overflow: "hidden",
    },
  });
}

// 使用memo提高渲染性能
const TabBarItem = memo(({
  routeName,
  isFocused,
  onPress,
  options,
  maxExpandedWidth,
  inactiveIconColor,
  styles,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  options: TabItem;
  maxExpandedWidth: number;
  inactiveIconColor: string;
  styles: ReturnType<typeof createStyles>;
}) => {
  // 使用单一动画值控制所有效果
  const progress = useSharedValue(isFocused ? 1 : 0);

  // 在状态变化时立即更新动画值，根据是展开还是收缩使用不同的动画配置
  React.useEffect(() => {
    // 如果是从选中到非选中，使用更快的动画配置
    const config = isFocused ? SPRING_CONFIG : CANCEL_SPRING_CONFIG;

    // 先取消之前未完成的动画
    progress.value = withSpring(
      isFocused ? 1 : 0,
      config,
    );
  }, [isFocused, progress]);

  // 自适应文本宽度计算 - 改进计算方法
  const textWidth = useMemo(() => {
    // 使用更高的字符宽度乘数并添加额外空间
    const calculatedWidth = options.label.length * CHAR_WIDTH_MULTIPLIER + TEXT_PADDING;

    // 确保宽度不超过最大限制
    return Math.min(calculatedWidth, maxExpandedWidth - TAB_ITEM_BASE_WIDTH);
  }, [options.label, maxExpandedWidth]);

  // 从progress派生动画值
  const labelWidth = useDerivedValue(() => {
    return progress.value * textWidth;
  });

  // 背景动画样式
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [options.inactiveBgColor, options.activeBgColor],
      ),
    };
  }, []);

  // 容器宽度动画 - 增加额外空间
  const containerStyle = useAnimatedStyle(() => {
    // 计算当前宽度：图标宽度 + 文本宽度比例 + 额外空间
    const extraPadding = progress.value * 8; // 额外的展开空间
    const currentWidth = TAB_ITEM_BASE_WIDTH + (progress.value * textWidth) + extraPadding;

    return {
      width: currentWidth,
    };
  }, [textWidth]);

  // 标签容器动画样式
  const labelContainerStyle = useAnimatedStyle(() => {
    return {
      width: labelWidth.value,
      opacity: progress.value,
    };
  }, []);

  const IconComponent = options.icon;

  return (
    <View style={styles.tabItemWrapper}>
      <Animated.View style={containerStyle}>
        <Pressable
          style={styles.tabItem}
          onPress={onPress}
          testID={`${routeName}-tab`}
        >
          <Animated.View style={[styles.tabItemBackground, backgroundStyle]} />

          <View style={styles.iconContainer}>
            <IconComponent color={isFocused ? options.activeColor : inactiveIconColor} />
          </View>

          <Animated.View style={[styles.labelContainer, labelContainerStyle]}>
            <Text
              style={[
                styles.tabItemLabel,
                { color: options.activeColor },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {options.label}
            </Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
});

interface ExtendedBottomTabBarProps extends BottomTabBarProps {
  tabs?: TabsConfig;
  iconMapping?: Record<string, React.ComponentType<{ color: string }>>;
  colorMapping?: Record<string, {
    activeColor: string;
    activeBgColor: string;
    inactiveBgColor: string;
  }>;
}

export function BubbleTabBar({
  state,
  navigation,
  descriptors,
  tabs: customTabs,
  iconMapping: customIconMapping,
  colorMapping: customColorMapping,
}: ExtendedBottomTabBarProps) {
  // 检测设备颜色模式
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 创建主题相关样式
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  // 获取当前主题下的非活动图标颜色和默认颜色
  const inactiveIconColor = isDark
    ? themes.dark.inactiveIconColor
    : themes.light.inactiveIconColor;

  const defaultTheme = isDark ? themes.dark : themes.light;

  // 简化图标映射处理
  const iconMapping = useMemo(() => {
    return customIconMapping || {};
  }, [customIconMapping]);

  // 简化颜色映射处理
  const colorMapping = useMemo(() => {
    return customColorMapping || {};
  }, [customColorMapping]);

  // 从React Navigation配置中构建tabs
  const generatedTabs = useMemo(() => {
    if (customTabs) {
      return customTabs;
    }

    const tabs: TabsConfig = {};

    state.routes.forEach((route) => {
      const descriptor = descriptors[route.key] as BottomTabDescriptor;
      const { options } = descriptor;
      const routeName = route.name;

      // 获取标签文本
      let label = (options.title || routeName) as string;
      if (options.tabBarLabel) {
        if (typeof options.tabBarLabel === "string") {
          label = options.tabBarLabel;
        } else if (typeof options.tabBarLabel === "function") {
          // 尝试从函数中获取标签
          const labelResult = options.tabBarLabel({
            focused: false,
            color: "",
            children: "",
            // 添加缺少的position属性
            position: "beside-icon",
          });
          if (typeof labelResult === "string") {
            label = labelResult;
          }
        }
      }

      // 获取图标组件 - 优先使用React Navigation提供的tabBarIcon
      let icon;
      if (options.tabBarIcon) {
        // 创建一个包装函数来适配React Navigation的tabBarIcon格式
        icon = ({ color }: { color: string }) => {
          if (typeof options.tabBarIcon === "function") {
            return options.tabBarIcon({
              focused: false,
              color,
              size: 24,
            });
          }
          return null;
        };
      } else if (iconMapping[routeName]) {
        // 如果提供了自定义图标映射，则使用它
        icon = iconMapping[routeName];
      } else {
        // 使用圆形图标作为默认备选
        icon = CircleIcon;
      }

      // 获取颜色配置 - 优先使用React Navigation提供的颜色
      const activeColor = options.tabBarActiveTintColor
        || (colorMapping[routeName]?.activeColor)
        || defaultTheme.defaultActiveColor;

      const activeBgColor = options.tabBarActiveBackgroundColor
        || (colorMapping[routeName]?.activeBgColor)
        || defaultTheme.defaultActiveBgColor;

      const inactiveBgColor = options.tabBarInactiveBackgroundColor
        || (colorMapping[routeName]?.inactiveBgColor)
        || defaultTheme.defaultInactiveBgColor;

      tabs[routeName] = {
        label,
        icon,
        activeColor,
        activeBgColor,
        inactiveBgColor,
      };
    });

    return tabs;
  }, [state.routes, descriptors, customTabs, iconMapping, colorMapping, defaultTheme]);

  // 计算最大展开宽度 - 增加可用空间分配
  const maxExpandedWidth = useMemo(() => {
    // 总可用宽度 减去 两个未选中项的基础宽度
    const maxWidth = AVAILABLE_WIDTH - (TAB_ITEM_BASE_WIDTH * 1.7); // 稍微减少未选中项占用空间
    // 允许占用更多空间
    return Math.min(maxWidth, MAX_ITEM_WIDTH);
  }, []);

  const getTabItemProps = useCallback((route: any, index: number) => {
    const routeName = route.name;
    const isFocused = state.index === index;
    const options = generatedTabs[routeName];

    if (!options) {
      return null;
    }

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };

    return {
      routeName,
      isFocused,
      onPress,
      options,
      maxExpandedWidth,
      inactiveIconColor,
      styles,
    };
  }, [navigation, state.index, maxExpandedWidth, generatedTabs, inactiveIconColor, styles]);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const props = getTabItemProps(route, index);
        if (!props) {
          return null;
        }

        return (
          <TabBarItem
            key={route.key}
            {...props}
          />
        );
      })}
    </View>
  );
}
