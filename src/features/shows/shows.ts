export type Show = {
    id: string;
    headliner: string;
    night: string;
    
    // ISO date string
    venue: string;
    seatsLeft: number;
};

export const SHOWS: Show[] = [{
    id: 's1',
    headliner: 'Dana Vega',
    night: '2026-09-18T20:00:00Z',
    venue: 'Main Room',
    seatsLeft: 12,
}, {
    id: 's2',
    headliner: 'Marcus Lin',
    night: '2026-09-19T21:30:00Z',
    venue: 'Basement',
    seatsLeft: 4,
}, {
    id: 's3',
    headliner: 'Priya Okafor',
    night: '2026-09-20T20:00:00Z',
    venue: 'Main Room',
    seatsLeft: 27,
}, {
    id: 's4',
    headliner: 'The Open Mic Gauntlet',
    night: '2026-09-21T19:00:00Z',
    venue: 'Basement',
    seatsLeft: 40,
}, {
    id: 's5',
    headliner: 'Sofia Grant',
    night: '2026-09-25T20:00:00Z',
    venue: 'Main Room',
    seatsLeft: 8,
}, {
    id: 's6',
    headliner: 'Late Night Roast Battle',
    night: '2026-09-26T22:00:00Z',
    venue: 'Basement',
    seatsLeft: 2,
}];

export const sortByScarcity = (shows: Show[]): Show[] => shows.toSorted((a, b) => a.seatsLeft - b.seatsLeft);
