import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/layout/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBar: (props) => <TabBar {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trade',
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
        }}
      />
      <Tabs.Screen
        name="earn"
        options={{
          title: 'Earn',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
