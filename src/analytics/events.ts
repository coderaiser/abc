// Single source of truth for analytics events.
// Rules: snake_case names, past-tense verbs, no PII (no name / email), only
// properties that answer a product question.

export type JokeTrigger = 'initial' | 'manual' | 'auto';

export type AnalyticsEvents = {
  joke_loaded: {joke_id: number; trigger: JokeTrigger};
  joke_load_failed: {trigger: JokeTrigger; reason: string};
  show_opened: {show_id: string; position: number};
  shows_sorted: {sort: 'date' | 'seats_left'};
  booking_started: {source: 'home' | 'show_details'};
  booking_validation_failed: {fields: string[]};
  booking_submitted: {quantity: number; show_id?: string};
};

export type EventName = keyof AnalyticsEvents;
