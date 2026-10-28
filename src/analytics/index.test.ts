import * as amplitude from '@amplitude/analytics-react-native';
import {
    initAnalytics,
    trackBookingSubmitted,
    trackJokeLoaded,
    trackJokeRefreshed,
} from '.';

test('initAnalytics: initialises Amplitude', () => {
    initAnalytics();
    
    expect(amplitude.init).toHaveBeenCalledWith('REPLACE_WITH_YOUR_AMPLITUDE_API_KEY');
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
        name: 'Ann',
        email: 'ann@example.com',
        quantity: 3,
    };
    
    trackBookingSubmitted(props);
    
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', props);
});
