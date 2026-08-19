import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { formValidationErrorProvider, maskitoCurrencyOptions } from '../../../utils/utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiInput } from '@taiga-ui/core';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'input-currency-component',
  imports: [
    ReactiveFormsModule,
    TuiInput,
    MaskitoDirective,
    TuiError
  ],
  templateUrl: './input-currency.component.html',
  styleUrl: './input-currency.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputCurrencyComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl<string | null>>()

  icon = input("")

  maskitoCurrency = maskitoCurrencyOptions
}
