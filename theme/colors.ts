import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  transparent: 'transparent',
  shadow: '#000',
  // Trophy/Medal colors
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  // Messaging colors
  messagingPrimary: '#4FC3F7',
  messagingSecondary: '#1976D2',
  // Social/Friends colors
  socialPrimary: '#81C784',
  socialSecondary: '#388E3C',
  socialAccent: '#4CAF50',
  // Text alpha colors
  textPrimary: 'rgba(255,255,255,0.8)',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.6)',
  textQuaternary: 'rgba(255,255,255,0.5)',
  textPrimaryLight: 'rgba(0,0,0,0.8)',
  textSecondaryLight: 'rgba(0,0,0,0.7)',
  textTertiaryLight: 'rgba(0,0,0,0.6)',
  textQuaternaryLight: 'rgba(0,0,0,0.4)',
  // Modal overlay
  modalOverlay: 'rgba(0,0,0,0.5)',
  // Glass gradients
  glassGradientPrimary: 'rgba(255,255,255,0.15)',
  glassGradientSecondary: 'rgba(255,255,255,0.05)',
  glassGradientLightPrimary: 'rgba(255,255,255,0.4)',
  glassGradientLightSecondary: 'rgba(255,255,255,0.1)',
  glassLensEffectDark: 'rgba(255,255,255,0.03)',
  glassLensEffectLight: 'rgba(255,255,255,0.06)',
  light: {
    grey6: 'rgb(242, 242, 247)',
    grey5: 'rgb(230, 230, 235)',
    grey4: 'rgb(210, 210, 215)',
    grey3: 'rgb(199, 199, 204)',
    grey2: 'rgb(175, 176, 180)',
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(242, 242, 247)',
    foreground: 'rgb(0, 0, 0)',
    root: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    destructive: 'rgb(255, 56, 43)',
    primary: 'rgb(18, 0, 82)',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#0ea5e9',
    // Glass effect colors
    glass: {
      default: {
        light: 'rgba(255,255,255,0.20)',
        dark: 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.4)',
      },
      primary: {
        light: 'rgba(30, 58, 138, 0.08)',
        dark: 'rgba(30, 138, 66, 0.15)',
        border: 'rgba(30, 138, 48, 0.3)',
      },
      destructive: {
        light: 'rgba(220, 38, 38, 0.08)',
        dark: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.3)',
      },
      success: {
        light: 'rgba(34, 197, 94, 0.08)',
        dark: 'rgba(34, 197, 94, 0.15)',
        border: 'rgba(34, 197, 94, 0.3)',
      },
    },
    // Gradient colors
    gradients: {
      primary: ['#2563eb', '#06b6d4'],
      success: ['#10b981', '#059669'],
      info: ['#0ea5e9', '#0284c7'],
      destructive: ['#ef4444', '#dc2626'],
    },
    // Status colors
    status: {
      online: '#10B981',
      away: '#F59E0B',
      offline: '#6B7280',
      messageIcon: 'rgba(255,255,255,0.7)',
    },
    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  },
  dark: {
    grey6: 'rgb(21, 21, 24)',
    grey5: 'rgb(40, 40, 42)',
    grey4: 'rgb(55, 55, 57)',
    grey3: 'rgb(70, 70, 73)',
    grey2: 'rgb(99, 99, 102)',
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(255, 255, 255)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(28, 28, 30)',
    destructive: 'rgb(254, 67, 54)',
    primary: 'rgb(18, 0, 82)',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#0ea5e9',
    // Glass effect colors
    glass: {
      default: {
        light: 'rgba(255,255,255,0.08)',
        dark: 'rgba(255,255,255,0.20)',
        border: 'rgba(255,255,255,0.2)',
      },
      primary: {
        light: 'rgba(30, 58, 138, 0.15)',
        dark: 'rgba(30, 58, 138, 0.08)',
        border: 'rgba(30, 58, 138, 0.4)',
      },
      destructive: {
        light: 'rgba(220, 38, 38, 0.15)',
        dark: 'rgba(220, 38, 38, 0.08)',
        border: 'rgba(220, 38, 38, 0.4)',
      },
      success: {
        light: 'rgba(34, 197, 94, 0.15)',
        dark: 'rgba(34, 197, 94, 0.08)',
        border: 'rgba(34, 197, 94, 0.4)',
      },
    },
    // Gradient colors
    gradients: {
      primary: ['#2563eb', '#06b6d4'],
      success: ['#10b981', '#059669'],
      info: ['#0ea5e9', '#0284c7'],
      destructive: ['#ef4444', '#dc2626'],
    },
    // Status colors
    status: {
      online: '#10B981',
      away: '#F59E0B',
      offline: '#6B7280',
      messageIcon: 'rgba(255,255,255,0.7)',
    },
    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  transparent: 'transparent',
  shadow: '#000',
  // Trophy/Medal colors
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  // Messaging colors
  messagingPrimary: '#4FC3F7',
  messagingSecondary: '#1976D2',
  // Social/Friends colors
  socialPrimary: '#81C784',
  socialSecondary: '#388E3C',
  socialAccent: '#4CAF50',
  // Text alpha colors
  textPrimary: 'rgba(255,255,255,0.8)',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.6)',
  textQuaternary: 'rgba(255,255,255,0.5)',
  textPrimaryLight: 'rgba(0,0,0,0.8)',
  textSecondaryLight: 'rgba(0,0,0,0.7)',
  textTertiaryLight: 'rgba(0,0,0,0.6)',
  textQuaternaryLight: 'rgba(0,0,0,0.4)',
  // Modal overlay
  modalOverlay: 'rgba(0,0,0,0.5)',
  // Glass gradients
  glassGradientPrimary: 'rgba(255,255,255,0.15)',
  glassGradientSecondary: 'rgba(255,255,255,0.05)',
  glassGradientLightPrimary: 'rgba(255,255,255,0.4)',
  glassGradientLightSecondary: 'rgba(255,255,255,0.1)',
  glassLensEffectDark: 'rgba(255,255,255,0.03)',
  glassLensEffectLight: 'rgba(255,255,255,0.06)',
  light: {
    grey6: 'rgb(249, 249, 255)',
    grey5: 'rgb(215, 217, 228)',
    grey4: 'rgb(193, 198, 215)',
    grey3: 'rgb(113, 119, 134)',
    grey2: 'rgb(65, 71, 84)',
    grey: 'rgb(24, 28, 35)',
    background: 'rgb(249, 249, 255)',
    foreground: 'rgb(0, 0, 0)',
    root: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(18, 0, 82)',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#0ea5e9',
    // Glass effect colors
    glass: {
      default: {
        light: 'rgba(255,255,255,0.20)',
        dark: 'rgba(255,255,255,0.08)',
        border: 'rgba(255,255,255,0.4)',
      },
      primary: {
        light: 'rgba(30, 58, 138, 0.08)',
        dark: 'rgba(30, 58, 138, 0.15)',
        border: 'rgba(30, 58, 138, 0.3)',
      },
      destructive: {
        light: 'rgba(220, 38, 38, 0.08)',
        dark: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.3)',
      },
      success: {
        light: 'rgba(34, 197, 94, 0.08)',
        dark: 'rgba(34, 197, 94, 0.15)',
        border: 'rgba(34, 197, 94, 0.3)',
      },
    },
    // Gradient colors
    gradients: {
      primary: ['#2563eb', '#06b6d4'],
      success: ['#10b981', '#059669'],
      info: ['#0ea5e9', '#0284c7'],
      destructive: ['#ef4444', '#dc2626'],
    },
    // Status colors
    status: {
      online: '#10B981',
      away: '#F59E0B',
      offline: '#6B7280',
      messageIcon: 'rgba(255,255,255,0.7)',
    },
    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  },
  dark: {
    grey6: 'rgb(16, 19, 27)',
    grey5: 'rgb(39, 42, 50)',
    grey4: 'rgb(49, 53, 61)',
    grey3: 'rgb(54, 57, 66)',
    grey2: 'rgb(139, 144, 160)',
    grey: 'rgb(193, 198, 215)',
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(255, 255, 255)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(16, 19, 27)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(18, 0, 82)',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#0ea5e9',
    // Glass effect colors
    glass: {
      default: {
        light: 'rgba(255,255,255,0.08)',
        dark: 'rgba(255,255,255,0.20)',
        border: 'rgba(255,255,255,0.2)',
      },
      primary: {
        light: 'rgba(30, 58, 138, 0.15)',
        dark: 'rgba(30, 58, 138, 0.08)',
        border: 'rgba(30, 58, 138, 0.4)',
      },
      destructive: {
        light: 'rgba(220, 38, 38, 0.15)',
        dark: 'rgba(220, 38, 38, 0.08)',
        border: 'rgba(220, 38, 38, 0.4)',
      },
      success: {
        light: 'rgba(34, 197, 94, 0.15)',
        dark: 'rgba(34, 197, 94, 0.08)',
        border: 'rgba(34, 197, 94, 0.4)',
      },
    },
    // Gradient colors
    gradients: {
      primary: ['#2563eb', '#06b6d4'],
      success: ['#10b981', '#059669'],
      info: ['#0ea5e9', '#0284c7'],
      destructive: ['#ef4444', '#dc2626'],
    },
    // Status colors
    status: {
      online: '#10B981',
      away: '#F59E0B',
      offline: '#6B7280',
      messageIcon: 'rgba(255,255,255,0.7)',
    },
    // Overlay colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };
