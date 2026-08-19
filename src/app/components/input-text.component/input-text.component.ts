import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiInput } from '@taiga-ui/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'input-text-component',
  imports: [
    TuiInput,
    ReactiveFormsModule,
    TuiError,
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {

  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<string | null>>()

  icon = input("")
}
