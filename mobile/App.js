import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import store, { hydrateStore } from './src/store';
import { navigationRef } from './src/navigationRef';
import AppNavigator from './src/navigation/AppNavigator';
import Loader from './src/components/Loader';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateStore().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Loader />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
