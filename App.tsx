import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as amplitude from '@amplitude/analytics-react-native';

import {HomeScreen} from './src/HomeScreen';
import {ShowDetailsScreen} from './src/ShowDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  ShowDetails: {showId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO(candidate): move the key out of source, and decide where analytics setup
// really belongs.
amplitude.init('REPLACE_WITH_YOUR_AMPLITUDE_API_KEY');

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ShowDetails" component={ShowDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
