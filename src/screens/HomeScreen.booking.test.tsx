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

const fillAndBook = async () => {
    await renderHome();
    await fireEvent.changeText(screen.getByPlaceholderText('Full name'), 'Ann Lee');
    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'ann@example.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Tickets'), '4');
    await fireEvent.press(screen.getByText('Book now'));
};

test('confirmation is hidden until booking', async () => {
    await renderHome();
    
    expect(screen.queryByText(CONFIRMATION)).toBeNull();
});

test('keeps current behaviour: an empty form is booked without validation', async () => {
    await renderHome();
    await fireEvent.press(screen.getByText('Book now'));
    
    expect(screen.getByText(CONFIRMATION)).toBeTruthy();
});

test('keeps current behaviour: no validation error is shown for an empty form', async () => {
    await renderHome();
    await fireEvent.press(screen.getByText('Book now'));
    
    expect(screen.queryByText('Name is required')).toBeNull();
});

test('keeps current behaviour: tracks empty values for an empty form', async () => {
    await renderHome();
    await fireEvent.press(screen.getByText('Book now'));
    
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', {
        name: '',
        email: '',
        quantity: 2,
    });
});

test('keeps current behaviour: tracks the typed values including name and email', async () => {
    await fillAndBook();
    
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', {
        name: 'Ann Lee',
        email: 'ann@example.com',
        quantity: 4,
    });
});

test('shows the confirmation after a filled form is booked', async () => {
    await fillAndBook();
    
    expect(screen.getByText(CONFIRMATION)).toBeTruthy();
});
