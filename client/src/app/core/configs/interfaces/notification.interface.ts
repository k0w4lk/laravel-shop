import { Subscription } from 'rxjs';

export interface NotificationConfig {
  status?: string;
  title?: string;
  message?: string;
  duration?: number;
}

export interface Notification extends NotificationConfig {
  id?: number;
  timer?: Subscription;
}
