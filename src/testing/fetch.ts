export const jokePayload = {
    id: 0,
    type: 'general',
    setup: 'I told my therapist about my stage fright.',
    punchline: 'She said, "Break a leg." Now I have two problems.',
};

export const okResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    json: async () => body,
});

export const errorResponse = (status: number) => ({
    ok: false,
    status,
    json: async () => ({}),
});

export const fetchMock = jest.fn();

export const resetFetch = () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(okResponse(jokePayload));
};
