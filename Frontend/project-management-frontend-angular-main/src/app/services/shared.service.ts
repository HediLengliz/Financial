import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private featureNameSource = new BehaviorSubject<string>('');
  currentFeatureName = this.featureNameSource.asObservable();

  private reloadProfile = new Subject<void>();

  constructor() { }

  changeFeatureName(featureName: string) {
    this.featureNameSource.next(featureName);
  }

  reloadProfile$ = this.reloadProfile.asObservable();

  triggerReload(): void {
    this.reloadProfile.next();
  }
}
