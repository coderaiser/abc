import {fetchRandomJoke} from './jokes';
import {
    errorResponse,
    fetchMock,
    jokePayload,
    okResponse,
} from '../testing/fetch';

const URL = 'https://official-joke-api.appspot.com/random_joke';

afterEach(() => {
    jest.useRealTimers();
});

test('fetchRandomJoke: requests the random_joke endpoint', async () => {
    await fetchRandomJoke();
    
    expect(fetchMock).toHaveBeenCalledWith(URL, {
        signal: expect.any(AbortSignal),
    });
});

test('fetchRandomJoke: resolves with id, setup and punchline only', async () => {
    const joke = await fetchRandomJoke();
    
    expect(joke).toEqual({
        id: jokePayload.id,
        setup: jokePayload.setup,
        punchline: jokePayload.punchline,
    });
});

test('fetchRandomJoke: rejects with the status on a non-2xx response', async () => {
    fetchMock.mockResolvedValue(errorResponse(500));
    
    await expect(fetchRandomJoke()).rejects.toThrow('HTTP 500');
});

test('fetchRandomJoke: rejects when the network fails', async () => {
    fetchMock.mockRejectedValue(Error('Network request failed'));
    
    await expect(fetchRandomJoke()).rejects.toThrow('Network request failed');
});

test('fetchRandomJoke: rejects when the body is not JSON', async () => {
    fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
            throw new SyntaxError('Unexpected token');
        },
    });
    
    await expect(fetchRandomJoke()).rejects.toThrow('Unexpected token');
});

test.each([
    ['null', null],
    ['a string', 'joke'],
    ['a missing id', {
        setup: 's',
        punchline: 'p',
    }],
    ['a string id', {
        id: '1',
        setup: 's',
        punchline: 'p',
    }],
    ['a missing setup', {
        id: 1,
        punchline: 'p',
    }],
    ['a missing punchline', {
        id: 1,
        setup: 's',
    }],
])('fetchRandomJoke: rejects on %s', async (_name, body) => {
    fetchMock.mockResolvedValue(okResponse(body));
    
    await expect(fetchRandomJoke()).rejects.toThrow('invalid payload');
});

test('fetchRandomJoke: rejects with timeout when there is no answer in 8 s', async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementation((_url, {signal}) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(Error('aborted')));
    }));
    
    const assertion = expect(fetchRandomJoke()).rejects.toThrow('timeout');
    
    await jest.advanceTimersByTimeAsync(8000);
    await assertion;
});

test('fetchRandomJoke: leaves no pending timer after success', async () => {
    jest.useFakeTimers();
    await fetchRandomJoke();
    
    expect(jest.getTimerCount()).toBe(0);
});
