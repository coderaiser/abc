import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import * as amplitude from '@amplitude/analytics-react-native';
import {HomeScreen} from '../src/HomeScreen';

const CONFIRMATION = `You're on the list. See you at the show.`;

test('confirmation is hidden until booking', async () => {
    await render(
        <HomeScreen/>,
    );
    
    expect(screen.queryByText(CONFIRMATION)).toBeNull();
});

test('keeps current behaviour: an empty form is booked without validation', async () => {
    await render(
        <HomeScreen/>,
    );
    
    await fireEvent.press(screen.getByText('Book now'));
    
    expect(screen.getByText(CONFIRMATION)).toBeTruthy();
    expect(screen.queryByText('Name is required')).toBeNull();
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', {
        name: '',
        email: '',
        quantity: 2,
    });
});

test('keeps current behaviour: tracks the typed values including name and email', async () => {
    await render(
        <HomeScreen/>,
    );
    
    await fireEvent.changeText(screen.getByPlaceholderText('Full name'), 'Ann Lee');
    await fireEvent.changeText(screen.getByPlaceholderText('Email'), 'ann@example.com');
    await fireEvent.changeText(screen.getByPlaceholderText('Tickets'), '4');
    await fireEvent.press(screen.getByText('Book now'));
    
    expect(screen.getByDisplayValue('Ann Lee')).toBeTruthy();
    expect(amplitude.track).toHaveBeenCalledWith('booking_submitted', {
        name: 'Ann Lee',
        email: 'ann@example.com',
        quantity: 4,
    });
    expect(screen.getByText(CONFIRMATION)).toBeTruthy();
});
