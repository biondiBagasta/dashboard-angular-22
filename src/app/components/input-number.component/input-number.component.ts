import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiInput } from '@taiga-ui/core';

@Component({
  selector: 'input-number-component',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiInput
  ],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputNumberComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<number | null>>()

  icon = input("")
}
