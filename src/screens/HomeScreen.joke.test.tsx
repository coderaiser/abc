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

const renderHome = () => render(
    <HomeScreen/>,
);

const renderLoaded = async () => {
    const view = await renderHome();
    
    await screen.findByText(SETUP);
    
    return view;
};

const advance = (ms: number) => act(async () => {
    jest.advanceTimersByTime(ms);
});

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

test('shows the joke setup after the first load', async () => {
    await renderHome();
    
    expect(await screen.findByText(SETUP)).toBeTruthy();
});

test('shows the joke punchline after the first load', async () => {
    await renderLoaded();
    
    expect(screen.getByText(PUNCHLINE)).toBeTruthy();
});

test('removes the placeholder after the first load', async () => {
    await renderLoaded();
    
    expect(screen.queryByText('Warming up the mic…')).toBeNull();
});

test('tracks joke_loaded on mount', async () => {
    await renderLoaded();
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_loaded', {
        joke_id: 0,
        refresh_count: 0,
    });
});

test('"New joke" tracks joke_refreshed', async () => {
    await renderLoaded();
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_refreshed');
});

test('"New joke" loads another joke', async () => {
    await renderLoaded();
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(loaded()).toHaveLength(2);
});

test('keeps current behaviour: refresh_count lags one press behind', async () => {
    await renderLoaded();
    await fireEvent.press(screen.getByText('New joke'));
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(
        loaded().map(([, props]) => props.refresh_count),
    ).toEqual([0, 0, 1]);
});

test('does not refresh the joke before 30 seconds', async () => {
    await renderLoaded();
    await advance(29_999);
    
    expect(loaded()).toHaveLength(1);
});

test('refreshes the joke after 30 seconds', async () => {
    await renderLoaded();
    await advance(30_000);
    
    expect(loaded()).toHaveLength(2);
});

test('stops refreshing after unmount', async () => {
    const view = await renderLoaded();
    
    await view.unmount();
    await advance(60_000);
    
    expect(loaded()).toHaveLength(1);
});
