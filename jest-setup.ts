import "@testing-library/react-native/extend-expect";

// react-hook form setup for testing
// @ts-expect-error - Window object needed for react-hook-form
globalThis.window = {};
// @ts-expect-error - Setting window to globalThis for testing
globalThis.window = globalThis;
