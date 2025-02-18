import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'feature'
})
export class FeaturePipe implements PipeTransform {
    transform(value: string): string {
        console.log(value);
        if (value === 'incompleted') {
            // return `<span class="ml-auto badge badge-warning-soft">Incomplete</span>`;
            return 'badge-warning-soft';
        } else if (value === 'completed') {
            // return `<span class="ml-auto badge badge-success-soft">Complete</span>`;
            return 'badge-success-soft';
        } 
        return '';
    }
}
