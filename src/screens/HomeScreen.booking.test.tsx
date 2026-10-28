import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import * as amplitude from '@amplitude/analytics-react-native';
import {HomeScreen} from './HomeScreen';

const CONFIRMATION = `You're on the list. See you at the show.`;

const renderHome = () => render(
    <HomeScreen/>,
);

const type = (placeholder: string, value: string) => fireEvent.changeText(screen.getByPlaceholderText(placeholder), value);

const book = () => fireEvent.press(screen.getByText('Book now'));

type Fields = Partial<Record<'name' | 'email' | 'tickets', string>>;

const fill = async (overrides: Fields = {}) => {
    const {
        name = 'Ann Lee',
        email = 'ann@example.com',
        tickets = '4',
    } = overrides;
    
    await type('Full name', name);
    await type('Email', email);
    await type('Tickets', tickets);
};

const bookedCalls = () => (amplitude.track as jest.Mock).mock.calls.filter(([name]) => name === 'booking_submitted');

test('confirmation is hidden until booking', async () => {
    await renderHome();
    
    expect(screen.queryByText(CONFIRMATION)).toBeNull();
});

test('an empty submit shows the name error', async () => {
    await renderHome();
    await book();
    
    expect(await screen.findByText('Name is required')).toBeTruthy();
});

test('an empty submit shows the email error', async () => {
    await renderHome();
    await book();
    
    expect(await screen.findByText('Email is required')).toBeTruthy();
});

test('an empty submit does not show the confirmation', async () => {
    await renderHome();
    await book();
    await screen.findByText('Name is required');
    
    expect(screen.queryByText(CONFIRMATION)).toBeNull();
});

test('an empty submit does not track booking_submitted', async () => {
    await renderHome();
    await book();
    await screen.findByText('Name is required');
    
    expect(bookedCalls()).toHaveLength(0);
});

test('a bad email shows the email format error', async () => {
    await renderHome();
    await fill({
        email: 'nope',
    });
    await book();
    
    expect(await screen.findByText('Enter a valid email')).toBeTruthy();
});

test.each(['0', '7'])('%s tickets show the range error', async (tickets) => {
    await renderHome();
    await fill({
        tickets,
    });
    await book();
    
    expect(await screen.findByText('Choose 1 to 6 tickets')).toBeTruthy();
});

test('non-numeric tickets show the number error', async () => {
    await renderHome();
    await fill({
        tickets: 'abc',
    });
    await book();
    
    expect(await screen.findByText('Enter a number')).toBeTruthy();
});

test('a blur on an empty name shows the name error', async () => {
    await renderHome();
    await fireEvent(screen.getByPlaceholderText('Full name'), 'blur');
    
    expect(await screen.findByText('Name is required')).toBeTruthy();
});

test('a blur on an empty email shows the email error', async () => {
    await renderHome();
    await fireEvent(screen.getByPlaceholderText('Email'), 'blur');
    
    expect(await screen.findByText('Email is required')).toBeTruthy();
});

test('a blur on empty tickets shows the number error', async () => {
    await renderHome();
    await type('Tickets', '');
    await fireEvent(screen.getByPlaceholderText('Tickets'), 'blur');
    
    expect(await screen.findByText('Enter a number')).toBeTruthy();
});

test('a valid submit shows the confirmation', async () => {
    await renderHome();
    await fill();
    await book();
    
    expect(await screen.findByText(CONFIRMATION)).toBeTruthy();
});

test('a valid submit tracks booking_submitted with the quantity only', async () => {
    await renderHome();
    await fill();
    await book();
    await screen.findByText(CONFIRMATION);
    
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', {
        quantity: 4,
    });
});

test('a valid submit tracks booking_submitted once', async () => {
    await renderHome();
    await fill();
    await book();
    await screen.findByText(CONFIRMATION);
    
    expect(bookedCalls()).toHaveLength(1);
});
