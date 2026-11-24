// Tipos del contrato de telemetría CE (fuente de verdad: contract.json y elements.json).
export type EventName =
  | 'page_view' | 'navigation_click' | 'contact_click' | 'quote_click' | 'inventory_view'
  | 'filter_change' | 'search_submit' | 'form_start' | 'form_submit_attempt'
  | 'form_submit_success' | 'form_submit_error' | 'scroll_depth' | 'engagement';

export type ConsentState = 'unknown' | 'granted' | 'denied';

export type Props = Record<string, string | number>;

export interface TelemetryEvent {
  event_id: string;
  session_id: string;
  page_view_id: string;
  sequence: number;
  name: EventName;
  occurred_at: string;
  page_path: string;
  release_id: string;
  route_id?: string;
  properties: Props;
}

export interface Batch {
  schema_version: 1;
  events: TelemetryEvent[];
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type Clock = () => number;

export interface ElementSpec {
  event: EventName;
  placement: string;
  channel?: string;
  intent?: string;
}
