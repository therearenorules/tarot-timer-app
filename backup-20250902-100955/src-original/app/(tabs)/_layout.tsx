import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: '타이머' }} />
      <Tabs.Screen name="spreads" options={{ title: '스프레드' }} />
      <Tabs.Screen name="diary" options={{ title: '일기' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}