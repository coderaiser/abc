import * as amplitude from '@amplitude/analytics-react-native';
import {act, renderHook} from '@testing-library/react-native';
import * as jokes from '../../api/jokes';
import {useJoke} from './useJoke';

const noop = () => {};

const FIRST = {
    id: 1,
    setup: 'First setup',
    punchline: 'First punchline',
};

const SECOND = {
    id: 2,
    setup: 'Second setup',
    punchline: 'Second punchline',
};

type Handlers<T> = {
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
};

const deferred = <T>() => {
    const handlers = {} as Handlers<T>;
    const promise = new Promise<T>((resolve, reject) => {
        Object.assign(handlers, {
            resolve,
            reject,
        });
    });
    
    return {
        promise,
        ...handlers,
    };
};

const flush = () => act(async () => {});

const tracked = (name: string) => (amplitude.track as jest.Mock).mock.calls.filter(([event]) => event === name);

const refreshNow = (result: {
    current: {
        refresh: () => void;
    };
}) => act(async () => {
    result.current.refresh();
});

let fetchJoke: jest.SpyInstance;

const mountLoaded = async () => {
    const view = await renderHook(() => useJoke());
    
    await flush();
    
    return view;
};

beforeEach(() => {
    jest.useFakeTimers();
    fetchJoke = jest.spyOn(jokes, 'fetchRandomJoke');
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

test('the status is loading at the start', async () => {
    fetchJoke.mockReturnValue(new Promise(noop));
    
    const {result} = await renderHook(() => useJoke());
    
    expect(result.current.status).toBe('loading');
});

test('the status is ready after a good load', async () => {
    fetchJoke.mockResolvedValue(FIRST);
    
    const {result} = await mountLoaded();
    
    expect(result.current.status).toBe('ready');
});

test('the status is error after a rejected load', async () => {
    fetchJoke.mockRejectedValue(Error('offline'));
    
    const {result} = await mountLoaded();
    
    expect(result.current.status).toBe('error');
});

test('the status is ready after a rejected load and a good refresh', async () => {
    fetchJoke.mockRejectedValueOnce(Error('offline'));
    fetchJoke.mockResolvedValue(FIRST);
    
    const {result} = await mountLoaded();
    
    await refreshNow(result);
    
    expect(result.current.status).toBe('ready');
});

test('a rejected load tracks joke_load_failed with refresh_count 0', async () => {
    fetchJoke.mockRejectedValue(Error('offline'));
    
    await mountLoaded();
    
    expect(amplitude.track).toHaveBeenCalledWith('joke_load_failed', {
        refresh_count: 0,
    });
});

test('the previous joke stays after a rejected refresh', async () => {
    fetchJoke.mockResolvedValueOnce(FIRST);
    fetchJoke.mockRejectedValue(Error('offline'));
    
    const {result} = await mountLoaded();
    
    await refreshNow(result);
    
    expect(result.current.joke).toEqual(FIRST);
});

test('a response after unmount does not track joke_loaded', async () => {
    const pending = deferred<typeof FIRST>();
    
    fetchJoke.mockReturnValue(pending.promise);
    
    const view = await renderHook(() => useJoke());
    
    await view.unmount();
    pending.resolve(FIRST);
    await flush();
    
    expect(tracked('joke_loaded')).toHaveLength(0);
});

test('a rejection after unmount does not track joke_load_failed', async () => {
    const pending = deferred<typeof FIRST>();
    
    fetchJoke.mockReturnValue(pending.promise);
    
    const view = await renderHook(() => useJoke());
    
    await view.unmount();
    pending.reject(Error('offline'));
    await flush();
    
    expect(tracked('joke_load_failed')).toHaveLength(0);
});

test('an older response does not replace a newer joke', async () => {
    const older = deferred<typeof FIRST>();
    const newer = deferred<typeof SECOND>();
    
    fetchJoke.mockReturnValueOnce(older.promise);
    fetchJoke.mockReturnValueOnce(newer.promise);
    
    const {result} = await renderHook(() => useJoke());
    
    await refreshNow(result);
    newer.resolve(SECOND);
    await flush();
    older.resolve(FIRST);
    await flush();
    
    expect(result.current.joke).toEqual(SECOND);
});

test('an older rejection does not set the error status', async () => {
    const older = deferred<typeof FIRST>();
    const newer = deferred<typeof SECOND>();
    
    fetchJoke.mockReturnValueOnce(older.promise);
    fetchJoke.mockReturnValueOnce(newer.promise);
    
    const {result} = await renderHook(() => useJoke());
    
    await refreshNow(result);
    newer.resolve(SECOND);
    await flush();
    older.reject(Error('offline'));
    await flush();
    
    expect(result.current.status).toBe('ready');
});
