import React, { useRef } from 'react';
import { View } from 'tamagui';
import { Alert, StyleSheet } from 'react-native';

import { Form, Input, Button } from 'components';
import { FormRef } from './Form';
import { verticalScale } from 'utils';

// Định nghĩa type cho form data
interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

const FormExample = () => {
  const formRef = useRef<FormRef<LoginFormData>>(null);

  const handleSubmit = (data: LoginFormData) => {
    console.log('Form data:', data);
    Alert.alert('Success', `Login with email: ${data.email}`);
  };

  const handleReset = () => {
    formRef.current?.reset();
  };

  return (
    <View flex={1} padding={20}>
      <Form<LoginFormData>
        ref={formRef}
        defaultValues={{
          email: '',
          password: '',
          confirmPassword: '',
          rememberMe: false,
        }}
        onSubmit={handleSubmit}
      >
        {/* Email Input */}
        <Form.Item
          name="email"
          label="Email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
        >
          <Input
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Form.Item>

        {/* Password Input */}
        <Form.Item
          name="password"
          label="Password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        >
          <Input placeholder="Enter your password" isPassword secureTextEntry />
        </Form.Item>

        {/* Confirm Password Input */}
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={{
            required: 'Please confirm your password',
            validate: (value, formValues) => {
              if (value !== formValues.password) {
                return 'Passwords do not match';
              }
              return true;
            },
          }}
        >
          <Input placeholder="Confirm your password" isPassword secureTextEntry />
        </Form.Item>

        {/* Submit Button */}
        <Form.Submit label="Login" />

        {/* Reset Button */}
        <Button variant="secondary" onPress={handleReset} style={styles.marginTop10}>
          <Button.Text>Reset Form</Button.Text>
        </Button>
      </Form>
    </View>
  );
};

export default FormExample;

const styles = StyleSheet.create({
  marginTop10: {
    marginTop: verticalScale(10),
  },
});
