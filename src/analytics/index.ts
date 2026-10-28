import * as amplitude from '@amplitude/analytics-react-native';

// TODO(candidate): move the key out of source.
export const initAnalytics = () => {
    amplitude.init('REPLACE_WITH_YOUR_AMPLITUDE_API_KEY');
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
