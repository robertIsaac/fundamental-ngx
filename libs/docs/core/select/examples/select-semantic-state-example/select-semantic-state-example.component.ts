import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormItemModule, FormMessageModule } from '@fundamental-ngx/core/form';
import { SelectModule } from '@fundamental-ngx/core/select';

@Component({
    selector: 'fd-select-semantic-state-example',
    templateUrl: './select-semantic-state-example.component.html',
    standalone: true,
    imports: [FormItemModule, SelectModule, NgFor, FormMessageModule]
})
export class SelectSemanticStateExampleComponent {
    options: string[] = ['Apple', 'Pineapple', 'Tomato', 'Strawberry'];
    selectedValue1: string;
    selectedValue2: string;
    selectedValue3: string;
    selectedValue4: string;
}
