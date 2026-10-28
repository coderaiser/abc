// Docs: https://github.com/15Dkatz/official_joke_api
const RANDOM_JOKE_URL = 'https://official-joke-api.appspot.com/random_joke';
const TIMEOUT_MS = 8000;

export type Joke = {
    id: number;
    setup: string;
    punchline: string;
};

const isJoke = (data: unknown): data is Joke => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const {
        id,
        setup,
        punchline,
    } = data as Record<string, unknown>;

    return typeof id === 'number'
        && typeof setup === 'string'
        && typeof punchline === 'string';
};

// Throws on network failure, timeout, non-2xx status or an unexpected payload.
export async function fetchRandomJoke(): Promise<Joke> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(RANDOM_JOKE_URL, {
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!isJoke(data)) {
            throw new Error('invalid payload');
        }

        return {
            id: data.id,
            setup: data.setup,
            punchline: data.punchline,
        };
    } catch (error) {
        if (controller.signal.aborted) {
            throw new Error('timeout');
        }

        throw error;
    } finally {
        clearTimeout(timer);
    }
}
