import * as amplitude from '@amplitude/analytics-react-native';
import {
    act,
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import {HomeScreen} from './HomeScreen';

const SETUP = 'I told my therapist about my stage fright.';
const PUNCHLINE = 'She said, "Break a leg." Now I have two problems.';

const loaded = () => (amplitude.track as jest.Mock).mock.calls.filter(([name]) => name === 'joke_loaded');

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

test('shows the joke after the first load', async () => {
    await render(
        <HomeScreen/>,
    );
    
    expect(await screen.findByText(SETUP)).toBeTruthy();
    expect(screen.getByText(PUNCHLINE)).toBeTruthy();
    expect(screen.queryByText('Warming up the mic…')).toBeNull();
});

test('tracks joke_loaded on mount', async () => {
    await render(
        <HomeScreen/>,
    );
    await screen.findByText(SETUP);
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_loaded', {
        joke_id: 0,
        refresh_count: 0,
    });
});

test('"New joke" loads again and tracks joke_refreshed', async () => {
    await render(
        <HomeScreen/>,
    );
    await screen.findByText(SETUP);
    
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_refreshed');
    expect(loaded()).toHaveLength(2);
});

test('keeps current behaviour: refresh_count lags one press behind', async () => {
    await render(
        <HomeScreen/>,
    );
    await screen.findByText(SETUP);
    
    await fireEvent.press(screen.getByText('New joke'));
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(
        loaded().map(([, props]) => props.refresh_count),
    ).toEqual([0, 0, 1]);
});

test('refreshes the joke every 30 seconds', async () => {
    await render(
        <HomeScreen/>,
    );
    await screen.findByText(SETUP);
    
    await act(async () => {
        jest.advanceTimersByTime(29_999);
    });
    expect(loaded()).toHaveLength(1);
    
    await act(async () => {
        jest.advanceTimersByTime(1);
    });
    expect(loaded()).toHaveLength(2);
});

test('stops refreshing after unmount', async () => {
    const view = await render(
        <HomeScreen/>,
    );
    
    await screen.findByText(SETUP);
    
    await view.unmount();
    await act(async () => {
        jest.advanceTimersByTime(60_000);
    });
    
    expect(loaded()).toHaveLength(1);
});
