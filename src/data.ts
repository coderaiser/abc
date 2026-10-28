export type Joke = {
  id: number;
  setup: string;
  punchline: string;
};

// Starter stub. It always returns the same static joke.
//
// Candidate task: replace this with a real integration against the
// Official Joke API. Decide which endpoint to use, how to type the
// response, and how to handle loading and failure.
//   Docs: https://github.com/15Dkatz/official_joke_api
export async function fetchRandomJoke(): Promise<Joke> {
  return {
    id: 0,
    setup: 'I told my therapist about my stage fright.',
    punchline: 'She said, "Break a leg." Now I have two problems.',
  };
}

export type Show = {
  id: string;
  headliner: string;
  night: string; // ISO date string
  venue: string;
  seatsLeft: number;
};

export const SHOWS: Show[] = [
  {id: 's1', headliner: 'Dana Vega', night: '2026-09-18T20:00:00Z', venue: 'Main Room', seatsLeft: 12},
  {id: 's2', headliner: 'Marcus Lin', night: '2026-09-19T21:30:00Z', venue: 'Basement', seatsLeft: 4},
  {id: 's3', headliner: 'Priya Okafor', night: '2026-09-20T20:00:00Z', venue: 'Main Room', seatsLeft: 27},
  {id: 's4', headliner: 'The Open Mic Gauntlet', night: '2026-09-21T19:00:00Z', venue: 'Basement', seatsLeft: 40},
  {id: 's5', headliner: 'Sofia Grant', night: '2026-09-25T20:00:00Z', venue: 'Main Room', seatsLeft: 8},
  {id: 's6', headliner: 'Late Night Roast Battle', night: '2026-09-26T22:00:00Z', venue: 'Basement', seatsLeft: 2},
];

export const colors = {
  bg: '#0E0B14',
  card: '#1B1622',
  text: '#F4EFFA',
  muted: '#A99FB8',
  accent: '#E8B04B',
  danger: '#E5484D',
};
