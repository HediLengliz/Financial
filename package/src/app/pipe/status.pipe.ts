import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'status'})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'pending') return 'badge-primary-soft';
    if (value === 'planning') return 'badge-secondary-soft';
    if (value === 'processing') return 'badge-info-soft';
    if (value === 'hold') return 'badge-danger-soft';
    if (value === 'recheck') return 'badge-warning-soft';
    if (value === 'not_to_do') return 'bg-info text-dark';
    if (value === 'done' || value === 'completed') return 'badge-success-soft';
    return '';
  }
}
