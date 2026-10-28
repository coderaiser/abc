import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import {ShowDetailsScreen} from './ShowDetailsScreen';
import {navigation, route} from '../testing/navigation';

const renderDetails = () => render(
    <ShowDetailsScreen/>,
);

test('shows the headliner of the routed show', async () => {
    await renderDetails();
    
    expect(screen.getByText('Marcus Lin')).toBeTruthy();
});

test('shows the venue and seats of the routed show', async () => {
    await renderDetails();
    
    expect(screen.getByText('Basement · 4 seats left')).toBeTruthy();
});

test('falls back to a generic title for an unknown show', async () => {
    route.params.showId = 'unknown';
    
    await renderDetails();
    
    expect(screen.getByText('Show')).toBeTruthy();
});

test('"Back" goes back', async () => {
    await renderDetails();
    await fireEvent.press(screen.getByText('‹ Back'));
    
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
});
