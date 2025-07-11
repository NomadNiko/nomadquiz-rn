import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// LinearGradient removed - using GradientButton component
import { COLORS } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';
// Ionicons removed - using FormFieldGroup component
// LoadingSpinner removed - using GradientButton component
import AppLogo from '../components/AppLogo';
import FormFieldGroup from '../components/form/FormFieldGroup';
import ModalContainer from '../components/ui/ModalContainer';
import GradientButton from '../components/ui/GradientButton';
import FadeSlideAnimation from '../components/animated/FadeSlideAnimation';
import { TEXT_STYLES } from '../theme/fonts';

const AuthScreen: React.FC = () => {
  const { checkSession } = useAuth();
  const { isDark } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const colors = isDark ? COLORS.dark : COLORS.light;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (isSignUp) {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Error', 'Please enter your first and last name');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await authService.register(email.trim(), password, firstName.trim(), lastName.trim());
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully. Please sign in with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsSignUp(false);
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
              },
            },
          ]
        );
      } else {
        const response = await authService.login(email.trim(), password);
        if (response.token) {
          await checkSession();
        }
      }
    } catch (error: any) {
      let errorMessage = 'Authentication failed';
      if (error.message) {
        if (error.message.includes('email')) {
          errorMessage = 'Invalid email address';
        } else if (error.message.includes('password')) {
          errorMessage = 'Invalid password';
        } else if (error.message.includes('credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('exists')) {
          errorMessage = 'An account with this email already exists';
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      Alert.alert(
        'Password Reset',
        'If an account with this email exists, you will receive password reset instructions.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
      setShowForgotPassword(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled">
          {/* Main Container */}
          <View
            style={{
              maxWidth: 400,
              width: '100%',
              alignSelf: 'center',
            }}>
            {/* Header */}
            <View style={{ marginBottom: 32, alignItems: 'center' }}>
              <FadeSlideAnimation duration={3000} style={{ marginBottom: 48 }}>
                <AppLogo width={280} height={93} />
              </FadeSlideAnimation>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  color: colors.foreground,
                  textAlign: 'center',
                  marginBottom: 8,
                  ...TEXT_STYLES.semibold,
                }}>
                {isSignUp ? 'Create Account' : 'Login to HostelSecure'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.grey2,
                  textAlign: 'center',
                  lineHeight: 20,
                  ...TEXT_STYLES.regular,
                }}>
                {isSignUp ? 'Sign up to secure your hostel' : ''}
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: 20 }}>
              {/* Name Fields for Sign Up */}
              {isSignUp && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <FormFieldGroup
                    label="First Name"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    containerStyle={{ flex: 1 }}
                    required
                  />
                  <FormFieldGroup
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    containerStyle={{ flex: 1 }}
                    required
                  />
                </View>
              )}

              {/* Email Field */}
              <FormFieldGroup
                label="Email"
                placeholder="m@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
                required
              />

              {/* Password Field */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.foreground,
                      ...TEXT_STYLES.medium,
                    }}>
                    Password {!isSignUp && <Text style={{ color: colors.destructive }}>*</Text>}
                  </Text>
                  {!isSignUp && (
                    <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                      <Text style={{ fontSize: 14, color: colors.primary, ...TEXT_STYLES.regular }}>
                        Forgot your password?
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <FormFieldGroup
                  label=""
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  showPasswordToggle
                  leftIcon="lock-closed"
                  autoCapitalize="none"
                  containerStyle={{ gap: 0 }}
                />
              </View>

              {/* Confirm Password for Sign Up */}
              {isSignUp && (
                <FormFieldGroup
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  showPasswordToggle
                  leftIcon="lock-closed"
                  autoCapitalize="none"
                  required
                />
              )}

              {/* Submit Button */}
              <GradientButton
                title={isSignUp ? 'Create Account' : 'Login'}
                onPress={handleAuth}
                isLoading={isLoading}
                style={{ marginTop: 8 }}
                size="medium"
              />
            </View>

            {/* Toggle Sign Up/Sign In */}
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 14, color: colors.grey2, ...TEXT_STYLES.regular }}>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsSignUp(!isSignUp);
                    if (!isSignUp) {
                      clearForm();
                    }
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.primary,
                      ...TEXT_STYLES.semibold,
                    }}>
                    {isSignUp ? 'Sign In' : 'Sign up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <ModalContainer
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Reset Password">
        <Text
          style={{
            fontSize: 14,
            color: colors.grey,
            textAlign: 'center',
            marginBottom: 32,
            ...TEXT_STYLES.regular,
          }}>
          {"Enter your email and we'll send reset instructions."}
        </Text>

        <FormFieldGroup
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon="mail"
          containerStyle={{ marginBottom: 24 }}
        />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: 44,
              borderWidth: 1,
              borderColor: colors.grey4,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setShowForgotPassword(false)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: colors.foreground,
                ...TEXT_STYLES.medium,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>

          <GradientButton
            title="Send Reset"
            onPress={handleForgotPassword}
            isLoading={isLoading}
            style={{ flex: 1 }}
          />
        </View>
      </ModalContainer>
    </SafeAreaView>
  );
};

export default AuthScreen;
