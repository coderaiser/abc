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
