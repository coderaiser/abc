import Config from 'react-native-config';

// Values come from .env at build time (see .env.example). Nothing secret is
// committed to the repo.
export const env = {
  amplitudeApiKey: Config.AMPLITUDE_API_KEY ?? '',
};
