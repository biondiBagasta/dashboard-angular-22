import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiSwitch } from '@taiga-ui/kit';
import { TuiError } from '@taiga-ui/core';

@Component({
  selector: 'toggle-field-component',
  imports: [
    ReactiveFormsModule,
    TuiSwitch,
    TuiError
  ],
  templateUrl: './toggle-field.component.html',
  styleUrl: './toggle-field.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleFieldComponent {
  label = input.required<string>();

  control = input.required<FormControl<boolean | null>>()
}
