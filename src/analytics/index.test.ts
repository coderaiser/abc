import * as amplitude from '@amplitude/analytics-react-native';
import Config from 'react-native-config';
import {
    initAnalytics,
    trackBookingSubmitted,
    trackJokeLoadFailed,
    trackJokeLoaded,
    trackJokeRefreshed,
} from '.';

afterEach(() => {
    Config.AMPLITUDE_API_KEY = 'test-amplitude-key';
});

test('initAnalytics: initialises Amplitude with the key from the environment', () => {
    initAnalytics();
    
    expect(amplitude.init).toHaveBeenCalledWith('test-amplitude-key');
});

test.each([undefined, ''])('initAnalytics: does not initialise Amplitude when the key is %j', (key) => {
    Config.AMPLITUDE_API_KEY = key;
    
    initAnalytics();
    
    expect(amplitude.init).not.toHaveBeenCalled();
});

test('trackJokeLoaded: sends joke_loaded with its properties', () => {
    trackJokeLoaded({
        joke_id: 7,
        refresh_count: 2,
    });
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_loaded', {
        joke_id: 7,
        refresh_count: 2,
    });
});

test('trackJokeRefreshed: sends joke_refreshed', () => {
    trackJokeRefreshed();
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_refreshed');
});

test('trackBookingSubmitted: sends booking_submitted with its properties', () => {
    const props = {
        quantity: 3,
    };
    
    trackBookingSubmitted(props);
    
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', props);
});

test('trackJokeLoadFailed: sends joke_load_failed with its properties', () => {
    trackJokeLoadFailed({
        refresh_count: 1,
    });
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_load_failed', {
        refresh_count: 1,
    });
});
