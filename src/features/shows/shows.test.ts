import {SHOWS, sortByScarcity} from './shows';

test('SHOWS: ids are unique', () => {
    const ids = new Set(SHOWS.map(({id}) => id));
    
    expect(ids.size).toBe(SHOWS.length);
});

test('SHOWS: seatsLeft are non-negative integers', () => {
    const valid = SHOWS.every(({seatsLeft}) => Number.isInteger(seatsLeft) && seatsLeft >= 0);
    
    expect(valid).toBe(true);
});

test('SHOWS: nights are valid dates', () => {
    const valid = SHOWS.every(({night}) => !Number.isNaN(Date.parse(night)));
    
    expect(valid).toBe(true);
});

test('SHOWS: headliners and venues are not empty', () => {
    const valid = SHOWS.every(({headliner, venue}) => headliner && venue);
    
    expect(valid).toBeTruthy();
});

test('sortByScarcity: orders by fewest seats', () => {
    const sorted = sortByScarcity(SHOWS);
    
    expect(sorted.map(({seatsLeft}) => seatsLeft)).toEqual([
        2,
        4,
        8,
        12,
        27,
        40,
    ]);
});

test('sortByScarcity: does not mutate the input', () => {
    const before = [];
    
    for (const {id} of SHOWS) {
        before.push(id);
    }
    
    sortByScarcity(SHOWS);
    
    expect(SHOWS.map(({id}) => id)).toEqual(before);
});
