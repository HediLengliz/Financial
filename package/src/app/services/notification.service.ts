import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Notification {
  id: string;
  message: string;
  type: string;
  recipientEmail: string;
  timestamp: string;
  actionUrl?: string;
  entityId?: any;
  entityType: string;
  read: boolean;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: WebSocket | null = null;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private toastr: ToastrService) { }

  /**
   * Initialize WebSocket connection to receive notifications
   */
  public connectToNotifications(userEmail: string): void {
    // Close existing connection if any
    this.disconnect();

    // Create new WebSocket connection
    // Replace with your actual WebSocket endpoint
    this.socket = new WebSocket(`ws://localhost:8080/financial/ws/notifications?email=${userEmail}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established for notifications');
    };

    this.socket.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;
        this.handleNewNotification(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (userEmail) {
          this.connectToNotifications(userEmail);
        }
      }, 5000);
    };
  }

  /**
   * Handle new notification: store it, update counts, show toast
   */
  private handleNewNotification(notification: Notification): void {
    // Update notifications array
    const currentNotifications = this.notifications.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notifications.next(updatedNotifications);

    // Update unread count
    this.unreadCount.next(this.unreadCount.value + 1);

    // Show toast notification
    this.showToastNotification(notification);
  }

  /**
   * Show toast for a new notification
   */
  private showToastNotification(notification: Notification): void {
    const config = {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-top-right'
    };

    // Create clickable notification with link if actionUrl exists
    const message = notification.actionUrl
      ? `<a href="${notification.actionUrl}">${notification.message}</a>`
      : notification.message;

    switch (notification.type.toUpperCase()) {
      case 'PAYMENT':
        this.toastr.success(message, 'Payment Notification', config);
        break;
      case 'ERROR':
        this.toastr.error(message, 'Error Notification', config);
        break;
      case 'WARNING':
        this.toastr.warning(message, 'Warning Notification', config);
        break;
      default:
        this.toastr.info(message, 'Notification', config);
    }
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Get all notifications as observable
   */
  public getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  /**
   * Get unread notification count as observable
   */
  public getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string): void {
    // Update local state
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => {
      if (n.id === notificationId && !n.read) {
        this.unreadCount.next(this.unreadCount.value - 1);
        return { ...n, read: true };
      }
      return n;
    });
    this.notifications.next(updatedNotifications);

    // Send update to backend
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'MARK_READ',
        notificationId: notificationId
      }));
    }
  }

  /**
   * Mark all notifications as read
   */
  public markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notifications.next(updatedNotifications);
    this.unreadCount.next(0);

    // Send update to backend
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'MARK_ALL_READ'
      }));
    }
  }
} 