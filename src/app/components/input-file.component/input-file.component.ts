import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFiles } from '@taiga-ui/kit';
import { formValidationErrorProvider } from '../../../utils/utils';
import { TuiError } from '@taiga-ui/core';

@Component({
  selector: 'input-file-component',
  imports: [
    TuiFiles,
    ReactiveFormsModule,
    TuiError
  ],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    formValidationErrorProvider
  ]
})
export class InputFileComponent {
  label = input.required<string>();
  control = input.required<FormControl<File | null>>()
}
