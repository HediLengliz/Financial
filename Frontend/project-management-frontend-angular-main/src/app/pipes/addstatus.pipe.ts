import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'addstatus'
})
export class AddStatusPipe implements PipeTransform {
    transform(value: string): string {
        console.log(value);
        if (value === 'pending') {
            return `<span class="ml-auto badge badge-primary-soft">PENDING</span>`;
        } else if (value === 'planning') {
            return `<span class="ml-auto badge-secondary-soft">PLANNING</span>`;
        } else if (value === 'processing') {
            return `<span class="ml-auto badge badge-info-soft">PROCESSING</span>`;
        } else if (value === 'hold') {
            return `<span class="ml-auto badge-warning-sof">HOLD</span>`;
        } else if (value === 'recheck') {
            return `<span class="ml-auto badge-danger-soft">RECHECK</span>`;
        } else if (value === 'not_to_do') {
            return `<span class="ml-auto badge-danger-soft">NOT TO DO</span>`;
        } else if (value === 'done' || value === 'completed') {
            return `<span class="ml-auto badge-success-sof">COMPLETED</span>`;
        }
        return '';
    }
}