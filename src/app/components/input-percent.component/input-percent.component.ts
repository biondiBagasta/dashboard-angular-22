import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { TuiError, TuiInput } from '@taiga-ui/core';
import { formValidationErrorProvider, maskitoPercentOptions } from '../../../utils/utils';

@Component({
  selector: 'input-percent-component',
  imports: [
    ReactiveFormsModule,
    MaskitoDirective,
    TuiInput,
    TuiError
  ],
  templateUrl: './input-percent.component.html',
  styleUrl: './input-percent.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPercentComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<string | null>>()

  icon = input("")

  maskitoPercent = maskitoPercentOptions
}
