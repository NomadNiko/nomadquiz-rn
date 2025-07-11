import React from 'react';
import { View, Dimensions, Platform } from 'react-native';

interface WebContainerProps {
  children: React.ReactNode;
}

export default function WebContainer({ children }: WebContainerProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: Math.min(428, width - 40),
          height: '100%',
          maxHeight: '95vh',
          backgroundColor: '#000',
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.5,
          shadowRadius: 60,
          elevation: 20,
        }}
      >
        {children}
      </View>
    </View>
  );
}