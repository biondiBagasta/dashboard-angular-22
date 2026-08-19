import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError } from '@taiga-ui/core';
import { TuiInputDate } from '@taiga-ui/kit';
import { TuiDay } from '@taiga-ui/cdk/date-time';

@Component({
  selector: 'input-date-component',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiInputDate
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    formValidationErrorProvider
  ]
})
export class InputDateComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<TuiDay | null>>()
}
