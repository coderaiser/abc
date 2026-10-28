import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import {HomeScreen} from '../src/HomeScreen';
import {SHOWS} from '../src/data';
import {navigation} from './helpers/navigation';

const headliners = () => screen
    .getAllByText(/seats left$/)
    .map((node) => node.props.children.join(''));

test('lists all shows in the default order', async () => {
    await render(
        <HomeScreen/>,
    );
    
    for (const {headliner} of SHOWS) {
        expect(screen.getByText(headliner)).toBeTruthy();
    }
    
    expect(headliners()).toEqual(SHOWS.map(({seatsLeft}) => `${seatsLeft} seats left`));
});

test('sort toggle switches the label and orders by fewest seats', async () => {
    await render(
        <HomeScreen/>,
    );
    
    expect(screen.getByText('Sort: date')).toBeTruthy();
    
    await fireEvent.press(screen.getByText('Sort: date'));
    
    expect(screen.getByText('Sort: fewest seats')).toBeTruthy();
    expect(headliners()).toEqual([
        '2 seats left',
        '4 seats left',
        '8 seats left',
        '12 seats left',
        '27 seats left',
        '40 seats left',
    ]);
    
    await fireEvent.press(screen.getByText('Sort: fewest seats'));
    
    expect(screen.getByText('Sort: date')).toBeTruthy();
    expect(headliners()[0]).toBe('12 seats left');
});

test('pressing a row navigates to the show details', async () => {
    await render(
        <HomeScreen/>,
    );
    
    await fireEvent.press(screen.getByText('Marcus Lin'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('ShowDetails', {
        showId: 's2',
    });
});

test('navigates with the id of the pressed row after sorting', async () => {
    await render(
        <HomeScreen/>,
    );
    
    await fireEvent.press(screen.getByText('Sort: date'));
    await fireEvent.press(screen.getByText('Late Night Roast Battle'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('ShowDetails', {
        showId: 's6',
    });
});
