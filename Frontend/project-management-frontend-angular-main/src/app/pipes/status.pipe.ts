import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'status'
})
export class StatusPipe implements PipeTransform {
    transform(value: string): string {
        console.log(value);
        if (value === 'pending') {
            return 'badge-primary-soft';
            // return `<span class="ml-auto badge badge-primary-soft">PENDING</span>`;
        } else if (value === 'planning') {
            return 'badge-secondary-soft';
            // return `<span class="ml-auto badge badge-secondary-soft">PLANNING</span>`;
        } else if (value === 'processing') {
            return 'badge-info-soft';
            // return `<span class="ml-auto badge badge-info-soft">PROCCESSING</span>`;
        } else if (value === 'hold') {
            return 'badge-danger-soft';
            // return `<span class="ml-auto badge badge-danger-soft">HOLD</span>`;
        } else if (value === 'recheck') {
            return 'badge-warning-soft';
            // return `<span class="ml-auto badge badge-warning-soft">RECHECK</span>`;
        } else if (value === 'not_to_do') {
            return 'bg-info text-dark';
        } else if (value === 'done' || value === 'completed') {
            return 'badge-success-soft';
            // return `<span class="ml-auto badge badge-success-soft">COMPLETED</span>`;
        }
        return '';
    }
}