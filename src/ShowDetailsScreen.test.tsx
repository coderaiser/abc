import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react-native';
import {ShowDetailsScreen} from './ShowDetailsScreen';
import {navigation, route} from './testing/navigation';

test('shows the headliner and venue of the routed show', async () => {
    await render(
        <ShowDetailsScreen/>,
    );
    
    expect(screen.getByText('Marcus Lin')).toBeTruthy();
    expect(screen.getByText('Basement · 4 seats left')).toBeTruthy();
});

test('falls back to a generic title for an unknown show', async () => {
    route.params.showId = 'unknown';
    
    await render(
        <ShowDetailsScreen/>,
    );
    
    expect(screen.getByText('Show')).toBeTruthy();
});

test('"Back" goes back', async () => {
    await render(
        <ShowDetailsScreen/>,
    );
    
    await fireEvent.press(screen.getByText('‹ Back'));
    
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
});
