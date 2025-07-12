import { Tabs } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../theme/colors';
import { TabBarIcon } from '../../components/TabBarIcon';
import ThemeToggle from '../../components/ThemeToggle';

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: isDark ? COLORS.dark.foreground : COLORS.light.foreground,
        tabBarInactiveTintColor: isDark ? COLORS.dark.grey : COLORS.light.grey,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          paddingHorizontal: 20,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          marginHorizontal: 4,
        },
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card,
        },
        headerTintColor: isDark ? COLORS.white : COLORS.black,
        headerRight: () => <ThemeToggle size={24} />,
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="school" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="leaderboards"
        options={{
          title: 'Leaderboards',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="trophy" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="chatbubbles" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="person" color={color} focused={focused} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
