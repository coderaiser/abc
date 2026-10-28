import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initAnalytics} from './src/analytics';
import {RootStackParamList} from './src/navigation/types';
import {HomeScreen} from './src/screens/HomeScreen';
import {ShowDetailsScreen} from './src/screens/ShowDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

initAnalytics();

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content"/>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="ShowDetails" component={ShowDetailsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
