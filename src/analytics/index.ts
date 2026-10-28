import * as amplitude from '@amplitude/analytics-react-native';
import {getAmplitudeApiKey} from '../config/env';

// The key comes from `.env` (AMPLITUDE_API_KEY). Without a key analytics is off.
export const initAnalytics = () => {
    const apiKey = getAmplitudeApiKey();
    
    if (!apiKey)
        return;
    
    amplitude.init(apiKey);
};

export type JokeLoadedProps = {
    joke_id: number;
    refresh_count: number;
};

export type BookingSubmittedProps = {
    quantity: number;
};

export const trackJokeLoaded = (props: JokeLoadedProps) => {
    amplitude.track('joke_loaded', props);
};

export type JokeLoadFailedProps = {
    refresh_count: number;
};

export const trackJokeLoadFailed = (props: JokeLoadFailedProps) => {
    amplitude.track('joke_load_failed', props);
};

export const trackJokeRefreshed = () => {
    amplitude.track('joke_refreshed');
};

export const trackBookingSubmitted = (props: BookingSubmittedProps) => {
    amplitude.track('booking_submitted', props);
};
