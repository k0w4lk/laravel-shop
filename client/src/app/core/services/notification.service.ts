import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import {
  Notification,
  NotificationConfig,
} from '../configs/interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public activeNotifications$: Observable<Notification[]>;

  private activeNotifications = new BehaviorSubject<Notification[]>([]);

  constructor() {
    this.activeNotifications$ = this.activeNotifications.asObservable();
  }

  public show(notificationConfig: NotificationConfig): void {
    const notification: Notification = { ...notificationConfig };

    if (this.activeNotifications.value.length === 3) {
      this.delete(this.activeNotifications.value[0].id);
    }

    const currentActiveNotifications = this.activeNotifications.value;
    notification.id = currentActiveNotifications.length;
    notification.timer = timer(notificationConfig.duration || 3000).subscribe(
      () => {
        this.delete(notification.id);
      }
    );
    currentActiveNotifications.push(notification);

    this.activeNotifications.next(currentActiveNotifications);
  }

  public delete(id: number): void {
    const currentActiveNotifications = this.activeNotifications.value;

    this.activeNotifications.next(
      currentActiveNotifications.filter(notification => {
        if (notification.id === id) {
          notification.timer.unsubscribe();
        }

        return notification.id !== id;
      })
    );
  }
}
