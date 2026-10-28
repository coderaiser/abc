jest.mock('react-native-reanimated', () => {
    const {View} = jest.requireActual('react-native');
    
    return {
        __esModule: true,
        default: {
            View,
        },
        useSharedValue: (value: number) => ({
            value,
        }),
        useAnimatedStyle: (factory: () => object) => factory(),
        withTiming: (value: number) => value,
    };
});

jest.mock('@amplitude/analytics-react-native', () => ({
    init: jest.fn(),
    track: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
    const {View} = jest.requireActual('react-native');
    
    return {
        SafeAreaView: View,
        SafeAreaProvider: View,
    };
});

jest.mock('@react-navigation/native', () => {
    const helpers = jest.requireActual('./__tests__/helpers/navigation');
    
    return {
        useNavigation: () => helpers.navigation,
        useRoute: () => helpers.route,
        NavigationContainer: ({children}: {children: unknown;}) => children,
    };
});

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({children}: {children: unknown;}) => children,
        Screen: ({name, component}: {name: string;component: () => unknown;}) => {
            const React = jest.requireActual('react');
            
            return name === 'Home' ? React.createElement(component) : null;
        },
    }),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.requireActual('./__tests__/helpers/navigation').route.params.showId = 's2';
});
