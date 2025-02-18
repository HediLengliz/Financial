import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'addpriority'
})
export class AddPriorityPipe implements PipeTransform {
    transform(value: string): string {
        console.log(value);
        if (value === 'high') {
            return `<span class="ml-auto badge badge-primary-soft">PENDING</span>`;
        } else if (value === 'medium') {
            return `<span class="ml-auto badge-secondary-soft">PLANNING</span>`;
        } else if (value === 'low') {
            return `<span class="ml-auto badge badge-info-soft">PROCESSING</span>`;
        }
        return '';
    }
}
