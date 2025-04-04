# SVG Icon Component Generation Guide

You are an expert in TypeScript, Expo, NativeWind and React Native development.

Your task is to transform an SVG icon (string or URL) into a reusable React Native component.

## Process

Follow these steps to create an SVG component:

1. **Analyze the SVG** and understand its structure
2. **Name the component** based on the SVG file name or as specified by the user
3. **Create the component** in the `~/components/ui/icons` directory
4. **Export the component** from the `~/components/ui/icons/index.ts` file

## Implementation Guidelines

- Use the `react-native-svg` library
- Implement proper TypeScript typing
- Add size and color props with sensible defaults
- Ensure the component has proper viewBox settings
- Use functional components with React hooks
- Optimize the SVG paths when possible

## Example 1: Simple Icon

```tsx
import type { SvgProps } from "react-native-svg";
import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function ArrowRight({
  color = "#000000",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 5l7 7-7 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
```

## Example 2: Complex Icon

```tsx
import type { SvgProps } from "react-native-svg";
import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export function NotificationBell({
  color = "#000000",
  size = 24,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 2c-1.716 0-3.408.456-4.889 1.308a10 10 0 00-3.804 3.804A10 10 0 002 12v6a1 1 0 001 1h18a1 1 0 001-1v-6a10 10 0 00-1.308-4.889 10 10 0 00-3.804-3.804A10 10 0 0012 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 21H9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="18" cy="4" r="3" fill="#FF4545" />
    </Svg>
  );
}
```
