import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import {HomeScreen} from './HomeScreen';
import {SHOWS} from '../features/shows/shows';
import {navigation} from '../testing/navigation';

const seats = () => screen
    .getAllByText(/seats left$/)
    .map((node) => node.props.children.join(''));

const renderHome = () => render(
    <HomeScreen/>,
);

const sortByFewestSeats = async () => {
    await renderHome();
    await fireEvent.press(screen.getByText('Sort: date'));
};

test('lists every show', async () => {
    await renderHome();
    
    expect(screen.getAllByText(/seats left$/)).toHaveLength(SHOWS.length);
});

test('lists shows in the default order', async () => {
    await renderHome();
    
    expect(seats()).toEqual(SHOWS.map(({seatsLeft}) => `${seatsLeft} seats left`));
});

test('the toggle starts with the date label', async () => {
    await renderHome();
    
    expect(screen.getByText('Sort: date')).toBeTruthy();
});

test('pressing the toggle switches to the fewest-seats label', async () => {
    await sortByFewestSeats();
    
    expect(screen.getByText('Sort: fewest seats')).toBeTruthy();
});

test('pressing the toggle orders shows by fewest seats', async () => {
    await sortByFewestSeats();
    
    expect(seats()).toEqual([
        '2 seats left',
        '4 seats left',
        '8 seats left',
        '12 seats left',
        '27 seats left',
        '40 seats left',
    ]);
});

test('pressing the toggle twice restores the date label', async () => {
    await sortByFewestSeats();
    await fireEvent.press(screen.getByText('Sort: fewest seats'));
    
    expect(screen.getByText('Sort: date')).toBeTruthy();
});

test('pressing the toggle twice restores the default order', async () => {
    await sortByFewestSeats();
    await fireEvent.press(screen.getByText('Sort: fewest seats'));
    
    expect(seats()[0]).toBe('12 seats left');
});

test('pressing a row navigates to the show details', async () => {
    await renderHome();
    await fireEvent.press(screen.getByText('Marcus Lin'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('ShowDetails', {
        showId: 's2',
    });
});

test('navigates with the id of the pressed row after sorting', async () => {
    await sortByFewestSeats();
    await fireEvent.press(screen.getByText('Late Night Roast Battle'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('ShowDetails', {
        showId: 's6',
    });
});
