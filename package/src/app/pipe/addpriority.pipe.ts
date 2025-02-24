import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addpriority' })
export class AddPriorityPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'high') return 'HIGH';
    if (value === 'medium') return 'MEDIUM';
    if (value === 'low') return 'LOW';
    return '';
  }
}
