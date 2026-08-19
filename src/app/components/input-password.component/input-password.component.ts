import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiIcon, TuiInput } from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import { formValidationErrorProvider } from '../../../utils/utils';
@Component({
  selector: 'input-password-component',
  imports: [
    ReactiveFormsModule,
    TuiError,
    TuiInput,
    TuiPassword,
    TuiIcon
  ],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent {
  label = input("");
  placeholder = input("");
  icon = input("")
  control = input.required<FormControl<string | null>>()
}
