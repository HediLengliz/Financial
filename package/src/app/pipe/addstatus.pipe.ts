import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addstatus' })
export class AddStatusPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'pending') return 'PENDING';
    if (value === 'planning') return 'PLANNING';
    if (value === 'processing') return 'PROCESSING';
    if (value === 'hold') return 'HOLD';
    if (value === 'recheck') return 'RECHECK';
    if (value === 'not_to_do') return 'NOT TO DO';
    if (value === 'done' || value === 'completed') return 'COMPLETED';
    return '';
  }
}
