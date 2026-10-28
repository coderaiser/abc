import {fetchRandomJoke} from './jokes';

test('fetchRandomJoke: resolves with the static stub joke', async () => {
    const joke = await fetchRandomJoke();
    
    expect(joke).toEqual({
        id: 0,
        setup: 'I told my therapist about my stage fright.',
        punchline: 'She said, "Break a leg." Now I have two problems.',
    });
});
