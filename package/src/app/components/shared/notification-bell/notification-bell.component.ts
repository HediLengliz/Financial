import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notification-bell position-relative">
      <div class="dropdown">
        <button class="btn btn-link text-dark position-relative" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-bell"></i>
          <span *ngIf="unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificationDropdown" style="width: 300px; max-height: 400px; overflow-y: auto;">
          <li class="dropdown-header d-flex justify-content-between align-items-center">
            <span>Notifications</span>
            <button *ngIf="unreadCount > 0" class="btn btn-sm btn-link text-primary" (click)="markAllAsRead()">Mark all as read</button>
          </li>
          <li *ngIf="notifications.length === 0" class="dropdown-item text-center text-muted py-3">No notifications</li>
          <li *ngFor="let notification of notifications" class="dropdown-item notification-item" [class.unread]="!notification.read">
            <a 
              [routerLink]="notification.actionUrl ? [notification.actionUrl] : []"
              (click)="markAsRead(notification.id)"
              class="d-block text-decoration-none"
            >
              <div class="d-flex">
                <div [ngClass]="getNotificationIconClass(notification.type)" class="notification-icon">
                  <i [ngClass]="getNotificationIcon(notification.type)"></i>
                </div>
                <div class="ms-2">
                  <div class="notification-message">{{ notification.message }}</div>
                  <div class="notification-time text-muted small">{{ formatTimestamp(notification.timestamp) }}</div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .notification-bell {
      cursor: pointer;
    }
    .notification-item {
      padding: 8px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    .notification-item.unread {
      background-color: #f0f7ff;
    }
    .notification-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .notification-icon.payment {
      background-color: #e6f7e6;
      color: #28a745;
    }
    .notification-icon.error {
      background-color: #f8d7da;
      color: #dc3545;
    }
    .notification-icon.warning {
      background-color: #fff3cd;
      color: #ffc107;
    }
    .notification-icon.info {
      background-color: #d1ecf1;
      color: #17a2b8;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Get user email from local storage or auth service
    const userEmail = localStorage.getItem('userEmail') || '';
    if (userEmail) {
      this.notificationService.connectToNotifications(userEmail);
    }

    // Subscribe to notifications
    this.subscriptions.add(
      this.notificationService.getNotifications().subscribe(notifications => {
        this.notifications = notifications;
      })
    );

    // Subscribe to unread count
    this.subscriptions.add(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.notificationService.disconnect();
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  getNotificationIconClass(type: string): string {
    switch (type.toUpperCase()) {
      case 'PAYMENT':
        return 'notification-icon payment';
      case 'ERROR':
        return 'notification-icon error';
      case 'WARNING':
        return 'notification-icon warning';
      default:
        return 'notification-icon info';
    }
  }

  getNotificationIcon(type: string): string {
    switch (type.toUpperCase()) {
      case 'PAYMENT':
        return 'fa fa-credit-card';
      case 'ERROR':
        return 'fa fa-exclamation-circle';
      case 'WARNING':
        return 'fa fa-exclamation-triangle';
      default:
        return 'fa fa-info-circle';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
} 