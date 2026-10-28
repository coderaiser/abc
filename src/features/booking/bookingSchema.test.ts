import {bookingSchema} from './useBookingForm';

const valid = {
    name: 'Ann',
    email: 'ann@example.com',
    quantity: '2',
};

test('bookingSchema: accepts valid data', async () => {
    await expect(bookingSchema.isValid(valid)).resolves.toBe(true);
});

test.each([
    ['empty name', {
        name: '',
    }],
    ['bad email', {
        email: 'nope',
    }],
    ['empty email', {
        email: '',
    }],
    ['zero tickets', {
        quantity: '0',
    }],
    ['seven tickets', {
        quantity: '7',
    }],
    ['non-numeric tickets', {
        quantity: 'abc',
    }],
])('bookingSchema: rejects %s', async (_, patch) => {
    await expect(bookingSchema.isValid({
        ...valid,
        ...patch,
    })).resolves.toBe(false);
});

test.each(['1', '6'])('bookingSchema: accepts %s tickets', async (quantity) => {
    await expect(bookingSchema.isValid({
        ...valid,
        quantity,
    })).resolves.toBe(true);
});

test.each([
    [{
        quantity: '0',
    }, 'Choose 1 to 6 tickets'],
    [{
        quantity: '7',
    }, 'Choose 1 to 6 tickets'],
    [{
        quantity: 'abc',
    }, 'Enter a number'],
    [{
        quantity: '',
    }, 'Enter a number'],
    [{
        name: '',
    }, 'Name is required'],
    [{
        email: '',
    }, 'Email is required'],
    [{
        email: 'nope',
    }, 'Enter a valid email'],
])('bookingSchema: %j gives the message %s', async (patch, message) => {
    await expect(bookingSchema.validate({
        ...valid,
        ...patch,
    })).rejects.toThrow(message);
});
