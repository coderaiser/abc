import {
    SHOWS,
    colors,
    fetchRandomJoke,
} from './data';

test('SHOWS: ids are unique', () => {
    const ids = [];
    
    for (const {id} of SHOWS) {
        ids.push(id);
    }
    
    expect(new Set(ids).size).toBe(ids.length);
});

test('SHOWS: every show has valid data', () => {
    for (const show of SHOWS) {
        expect(Number.isInteger(show.seatsLeft)).toBe(true);
        expect(show.seatsLeft).toBeGreaterThanOrEqual(0);
        expect(Number.isNaN(Date.parse(show.night))).toBe(false);
        expect(show.headliner).not.toBe('');
        expect(show.venue).not.toBe('');
    }
});

test('colors: defines the palette', () => {
    expect(colors.bg).toBe('#0E0B14');
});

test('fetchRandomJoke: resolves with the static stub joke', async () => {
    const joke = await fetchRandomJoke();
    
    expect(joke).toEqual({
        id: 0,
        setup: 'I told my therapist about my stage fright.',
        punchline: 'She said, "Break a leg." Now I have two problems.',
    });
});
