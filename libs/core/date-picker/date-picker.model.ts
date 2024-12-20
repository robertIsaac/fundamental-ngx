import { EventEmitter } from '@angular/core';
import { Nullable } from '@fundamental-ngx/cdk/utils';
import { DateRange } from '@fundamental-ngx/core/calendar';
import { MobileMode } from '@fundamental-ngx/core/mobile-mode';

export interface DatePicker<D> extends MobileMode {
    selectedDate: Nullable<D>;
    isOpenChange: EventEmitter<boolean>;
    dialogApprove(): void;
    dialogDismiss(value: D | Array<D> | DateRange<D> | Array<DateRange<D>>): void;
    getSelectedDate(): D | Array<D> | DateRange<D> | Array<DateRange<D>>;
}
