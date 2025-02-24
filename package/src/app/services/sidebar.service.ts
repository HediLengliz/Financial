import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private reloadSidebar = new Subject<void>();

  reloadSidebar$ = this.reloadSidebar.asObservable();

  triggerReload(): void {
    this.reloadSidebar.next();
  }
}
