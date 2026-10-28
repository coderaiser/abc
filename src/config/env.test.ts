import Config from 'react-native-config';
import {getAmplitudeApiKey} from './env';

afterEach(() => {
    Config.AMPLITUDE_API_KEY = 'test-amplitude-key';
});

test('getAmplitudeApiKey: returns the key from the environment', () => {
    expect(getAmplitudeApiKey()).toBe('test-amplitude-key');
});

test('getAmplitudeApiKey: returns undefined when the key is not set', () => {
    Config.AMPLITUDE_API_KEY = undefined;
    
    expect(getAmplitudeApiKey()).toBeUndefined();
});
