import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateRange } from '@taiga-ui/kit';

@Component({
  selector: 'daterange-filter-field-component',
  imports: [
    ReactiveFormsModule,
    TuiInputDateRange
  ],
  templateUrl: './daterange-filter-field.component.html',
  styleUrl: './daterange-filter-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaterangeFilterFieldComponent {
  label = input.required<string>();

  control = input.required<FormControl>()

}
