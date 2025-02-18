import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'priority'
})
export class PriorityPipe implements PipeTransform {
    transform(value: string): string {
        console.log(value);
        if (value === 'high') {
            return 'bg-primary';
        } else if (value === 'medium') {
            return 'bg-secondary';
        } else if (value === 'low') {
            return 'bg-dark';
        }
        return '';
    }
}
