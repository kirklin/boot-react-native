# Unit Test Writing Guide for Boot React Native

You are an expert in TypeScript, React Native, Expo, and testing with Jest and React Native Testing Library.

Your task is to write comprehensive unit tests for a given React Native component.

## Process

Follow these steps in sequence:

1. **Component Analysis**:
   Before writing tests, analyze the component by answering:
   - What is the primary purpose of this component?
   - What props does it accept?
   - What user interactions does it handle?
   - What state management does it use?
   - What external dependencies does it have?

2. **Test Scenario Identification**:
   Document all possible test scenarios following this hierarchy:
   - Basic rendering tests
   - Props testing
   - User interaction tests
   - State change tests
   - Error handling tests
   - Edge case tests

3. **Test Implementation**:
   Write unit tests following React Native Testing Library and Jest guidelines:
   - Name test files as `[ComponentName].test.tsx`
   - Use meaningful test descriptions
   - Keep tests focused and isolated
   - Clean up properly in afterEach/afterAll blocks
   - Add testID attributes for reliable element selection
   - Test both success and failure scenarios
   - Avoid testing implementation details
   - Avoid multiple assertions in waitFor callbacks
   - Ensure proper typing and parameters when mocking functions

4. **Test Execution**:
   Run tests with coverage: `pnpm test <ComponentName> -- --coverage --coverageReporters="text"`

5. **Result Analysis**:
   - If tests fail, analyze and fix issues
   - If coverage is low, identify missing test scenarios

## Example

Here's an example of a well-structured unit test:

```tsx
import React from "react";
import { cleanup, screen, setup, waitFor } from "~/lib/test-utils";

// Proper mock type definition
const onSubmitMock = jest.fn();

afterEach(cleanup);

describe("LoginForm", () => {
  // Setup section
  beforeEach(() => {
    // Reset mocks and state
    jest.clearAllMocks();
  });

  // Tests grouped by functionality
  describe("Rendering", () => {
    test("renders correctly with default props", async () => {
      setup(<LoginForm />);
      expect(await screen.findByTestId("login-form-title")).toBeOnTheScreen();
    });

    test("renders correctly with custom props", async () => {
      setup(<LoginForm onSubmit={onSubmitMock} />);
      expect(await screen.findByTestId("login-form-title")).toBeOnTheScreen();
    });
  });

  describe("Interactions", () => {
    test("handles user input correctly", async () => {
      const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

      // Get input fields
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");

      // Input valid data
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // Verify inputs are set correctly
      expect(emailInput).toHaveProp("value", "test@example.com");
      expect(passwordInput).toHaveProp("value", "password123");
    });

    test("triggers appropriate callbacks", async () => {
      const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

      // Get input fields and button
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const loginButton = screen.getByTestId("login-button");

      // Input valid data
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // Click login button
      await user.press(loginButton);

      // Verify callback was called
      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith(
          expect.objectContaining({
            email: "test@example.com",
            password: "password123",
          }),
          expect.anything()
        );
      });
    });
  });

  describe("Form Validation", () => {
    test("displays appropriate validation errors", async () => {
      const { user } = setup(<LoginForm onSubmit={onSubmitMock} />);

      // Get input fields and button
      const emailInput = screen.getByTestId("email-input");
      const loginButton = screen.getByTestId("login-button");

      // Input invalid email
      await user.type(emailInput, "invalid-email");

      // Click login button
      await user.press(loginButton);

      // Verify error message is displayed
      const errorMessage = await screen.findByText("Invalid email format");
      expect(errorMessage).toBeOnTheScreen();

      // Verify callback was not called
      expect(onSubmitMock).not.toHaveBeenCalled();
    });
  });
});
```

For more information, refer to the official documentation of React Native Testing Library: https://callstack.github.io/react-native-testing-library/
