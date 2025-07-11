# Image to Component Transformation Guide

You are an expert in TypeScript, React Native, Expo, and NativeWind UI development.

Your task is to create a functional React Native component based on a provided design image.

## Process

Follow these steps to transform the image into a working component:

1. **Layout Analysis**:
   - Identify the main layout structure in the image
   - Recognize key UI components (buttons, cards, lists, etc.)
   - Identify which components from `~/components/ui` can be used
   - Note any specific spacing, alignment, or positioning patterns

2. **Component Implementation**:
   - Use NativeWind for styling
   - Utilize shared components from `~/components/ui` when applicable
   - Follow accessibility best practices
   - Use colors from the Tailwind config
   - For images, use sources from `~/assets/images`
   - Remember that Animated.View doesn't support `className` (use `style` instead)
   - Create reusable sub-components when appropriate
   - Add type definitions for all props

## Example 1: Basic Card Component

```tsx
import * as React from "react";
import { Image, Text, View } from "~/components/ui";

interface ProfileCardProps {
  name: string;
  role: string;
  avatarUrl: string;
  onPress?: () => void;
}

export function ProfileCard({ name, role, avatarUrl, onPress }: ProfileCardProps) {
  return (
    <View
      className="flex-row items-center rounded-lg bg-white p-4 shadow-sm"
      accessibilityRole="button"
      onPress={onPress}
    >
      <Image
        source={{ uri: avatarUrl }}
        className="h-12 w-12 rounded-full"
        contentFit="cover"
      />
      <View className="ml-3">
        <Text className="text-lg font-semibold text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-500">{role}</Text>
      </View>
      <View className="ml-auto">
        <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-100">
          <Text className="text-xs font-medium text-primary-700">3</Text>
        </View>
      </View>
    </View>
  );
}
```

## Example 2: Form Component

```tsx
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import * as z from "zod";

import { Button, ControlledInput, Text, View } from "~/components/ui";

// Form validation schema
const schema = z.object({
  fullName: z
    .string({
      required_error: "Please enter your full name",
    })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({
      required_error: "Please enter your email",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Please enter a password",
    })
    .min(8, "Password must be at least 8 characters"),
});

export type SignupFormData = z.infer<typeof schema>;

interface SignupFormProps {
  onSubmit?: SubmitHandler<SignupFormData>;
  isLoading?: boolean;
}

export function SignupForm({
  onSubmit = () => {},
  isLoading = false
}: SignupFormProps) {
  const { handleSubmit, control } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={20}
    >
      <View className="flex-1 justify-center p-6">
        <Text testID="signup-title" className="mb-6 text-center text-3xl font-bold">
          Create Account
        </Text>

        <ControlledInput
          testID="name-input"
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <ControlledInput
          testID="password-input"
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button
          testID="signup-button"
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          className="mt-4"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
```
