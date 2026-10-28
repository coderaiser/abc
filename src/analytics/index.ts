import * as amplitude from '@amplitude/analytics-react-native';

import {env} from '../config/env';
import type {AnalyticsEvents, EventName} from './events';

let initialised = false;

// Called once from App.tsx. Without a key (fresh clone, CI) analytics becomes
// a no-op instead of crashing or sending to a placeholder project.
export function initAnalytics(): void {
  if (initialised) {
    return;
  }
  if (!env.amplitudeApiKey) {
    if (__DEV__) {
      console.warn('[analytics] AMPLITUDE_API_KEY is empty, events disabled');
    }
    return;
  }
  amplitude.init(env.amplitudeApiKey);
  initialised = true;
}

// Typed wrapper: event names and their properties are checked at compile time.
export function track<E extends EventName>(
  name: E,
  properties: AnalyticsEvents[E],
): void {
  if (!initialised) {
    return;
  }
  amplitude.track(name, properties);
}
