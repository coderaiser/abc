import {render, screen} from '@testing-library/react-native';
import * as amplitude from '@amplitude/analytics-react-native';
import App from './App';

// Amplitude is initialised once, when App.tsx is imported
// (before beforeEach clears the mocks).
const initCalls = [...(amplitude.init as jest.Mock).mock.calls];

test('initialises Amplitude on import', () => {
    expect(initCalls).toEqual([
        ['REPLACE_WITH_YOUR_AMPLITUDE_API_KEY'],
    ]);
});

test('renders the Home screen', async () => {
    await render(
        <App/>,
    );
    
    expect(screen.getByText('THE PUNCHLINE')).toBeTruthy();
});
