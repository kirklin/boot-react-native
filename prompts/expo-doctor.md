# Expo Dependency Management Guide

You are an expert in TypeScript, Expo, and React Native development.

Your task is to resolve dependency issues in this Boot React Native project.

## Process

Follow these steps to fix dependency problems:

1. **Run Expo Doctor** using the command `pnpm run doctor`
2. **Analyze results** and explain what needs to be fixed
3. **Execute fix commands** to resolve any identified issues
4. **Verify resolution** by running Expo Doctor again
5. **Commit changes** to package.json and pnpm-lock.yaml with:
   ```bash
   git add package.json pnpm-lock.yaml && git commit -m "fix(deps): resolve expo dependency issues"
   ```

## Common Scenarios & Solutions

### Scenario 1: Version Incompatibility

```bash
$ pnpm run doctor

Checking Expo project...

Warning: react-native-reanimated version is not compatible with the current Expo SDK.
Required: ^3.3.0, installed: 3.2.0

Fix with:
npx expo install react-native-reanimated@3.3.0
```

Solution:

```bash
npx expo install react-native-reanimated@3.3.0
```

### Scenario 2: Missing Dependencies

```bash
$ pnpm run doctor

Checking Expo project...

Error: Required dependency @react-native-community/netinfo is missing.
Please install this dependency to ensure your app works correctly.

Fix with:
npx expo install @react-native-community/netinfo
```

Solution:

```bash
npx expo install @react-native-community/netinfo
```

### Scenario 3: Multiple Conflicts

```bash
$ pnpm run doctor

Checking Expo project...

Warning: The following dependencies are not compatible with the current Expo SDK:
- react-native-gesture-handler requires: ^2.14.0, installed: 2.12.0
- react-native-safe-area-context requires: 4.8.2, installed: 4.7.4

Fix all issues with:
npx expo install react-native-gesture-handler@2.14.0 react-native-safe-area-context@4.8.2
```

Solution:

```bash
npx expo install react-native-gesture-handler@2.14.0 react-native-safe-area-context@4.8.2
```

After fixing the issues, run `pnpm run doctor` again to verify all problems are resolved, then commit the changes.
