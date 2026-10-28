import * as amplitude from '@amplitude/analytics-react-native';
import {
    act,
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import * as jokes from '../api/jokes';
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

test('the first load tracks refresh_count 0', async () => {
    await renderLoaded();
    
    expect(loaded()[0][1].refresh_count).toBe(0);
});

test('two manual refreshes track refresh_count 0, 1, 2', async () => {
    await renderLoaded();
    await fireEvent.press(screen.getByText('New joke'));
    await fireEvent.press(screen.getByText('New joke'));
    
    expect(
        loaded().map(([, props]) => props.refresh_count),
    ).toEqual([0, 1, 2]);
});

test('an automatic refresh after one manual refresh tracks refresh_count 1', async () => {
    await renderLoaded();
    await fireEvent.press(screen.getByText('New joke'));
    await advance(30_000);
    
    expect(loaded().at(-1)[1].refresh_count).toBe(1);
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

const ERROR_TEXT = 'Could not load a joke. Try again.';

test('a rejected first load shows the error text', async () => {
    jest
        .spyOn(jokes, 'fetchRandomJoke')
        .mockRejectedValueOnce(Error('offline'));
    
    await renderHome();
    
    expect(await screen.findByText(ERROR_TEXT)).toBeTruthy();
});

test('a good refresh after an error removes the error text', async () => {
    jest
        .spyOn(jokes, 'fetchRandomJoke')
        .mockRejectedValueOnce(Error('offline'));
    
    await renderHome();
    await screen.findByText(ERROR_TEXT);
    await fireEvent.press(screen.getByText('New joke'));
    await screen.findByText(SETUP);
    
    expect(screen.queryByText(ERROR_TEXT)).toBeNull();
});
