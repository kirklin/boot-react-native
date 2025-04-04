import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Animated, { FadeInUp } from "react-native-reanimated";

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from "~/components/ui";
import { useIsFirstTime } from "~/lib/hooks";

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

function FeatureItem({ icon, title, description, delay = 0 }: FeatureItemProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(300 + delay * 100).springify()}
      className="mb-4 bg-card rounded-xl p-4 border border-border"
    >
      <View className="flex-row items-center mb-2">
        <Text className="text-2xl mr-2">{icon}</Text>
        <Text className="text-lg font-semibold">{title}</Text>
      </View>
      <Text className="text-muted-foreground text-sm">{description}</Text>
    </Animated.View>
  );
}

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const { t } = useTranslation();

  const handleGetStarted = useCallback(() => {
    setIsFirstTime(false);
    router.replace("/login");
  }, [router, setIsFirstTime]);

  const features = useMemo(
    () => [
      {
        icon: "🚀",
        title: "Production Ready",
        description: "Built with best practices for immediate deployment with optimal performance and security.",
      },
      {
        icon: "⚡",
        title: "Developer Experience",
        description: "Optimized workflow with hot-reloading, TypeScript, and intuitive project structure.",
      },
      {
        icon: "🧩",
        title: "Minimal & Efficient",
        description: "Lightweight core with minimal dependencies ensures fast startup and smooth operation.",
      },
      {
        icon: "🛡️",
        title: "Well Maintained",
        description: "Leverages battle-tested libraries with active community support and regular updates.",
      },
    ],
    [],
  );

  return (
    <View className="flex h-full items-center justify-center bg-background">
      <FocusAwareStatusBar />

      <View className="px-6 w-full max-w-md">
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <Text className="my-3 text-center text-5xl font-bold">
            Boot React Native
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Text className="mb-6 text-center text-lg text-muted-foreground">
            {t("onboarding.message")}
          </Text>
        </Animated.View>

        <View className="mb-6">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </View>
      </View>

      <SafeAreaView className="w-full px-8">
        <Animated.View entering={FadeInUp.delay(700).springify()}>
          <Button
            label="Get Started"
            onPress={handleGetStarted}
            className="w-full"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
