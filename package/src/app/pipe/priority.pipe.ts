import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'priority'})
export class PriorityPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'high') return 'bg-primary';
    if (value === 'medium') return 'bg-secondary';
    if (value === 'low') return 'bg-dark';
    return '';
  }
}
