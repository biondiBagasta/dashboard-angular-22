import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TUI_VALIDATION_ERRORS, TuiError, TuiInput } from '@taiga-ui/core';
import { formValidationErrorProvider } from '../../../utils/utils';

@Component({
  selector: 'input-text-component',
  imports: [
    TuiInput,
    ReactiveFormsModule,
    TuiError
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent {

  @Input() label = "";
  @Input() placeholder = "";

  @Input({ required: true })
  control!: FormControl

  @Input() icon = ""
}
