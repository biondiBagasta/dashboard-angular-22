import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { TuiError } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'textarea-field-component',
  imports: [
    TuiError,
    TuiTextarea,
    ReactiveFormsModule
  ],
  templateUrl: './textarea-field.component.html',
  styleUrl: './textarea-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    formValidationErrorProvider
  ]
})
export class TextareaFieldComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<string | null>>()
}
