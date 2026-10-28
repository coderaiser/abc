import Config from 'react-native-config';

export const getAmplitudeApiKey = (): string | undefined => Config.AMPLITUDE_API_KEY;
