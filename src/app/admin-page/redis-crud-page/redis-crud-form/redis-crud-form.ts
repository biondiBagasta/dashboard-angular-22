import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '../../../components/input-text.component/input-text.component';
import { InputCurrencyComponent } from '../../../components/input-currency.component/input-currency.component';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { ControlsOf } from '../../../../utils/utils';
import { RedisProductFormControls } from '../redis-crud-page';

@Component({
  selector: 'app-redis-crud-form',
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    InputCurrencyComponent,
    TuiButton,
    TuiLoader
  ],
  templateUrl: './redis-crud-form.html',
  styleUrl: './redis-crud-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedisCrudForm {
  formGroup = input.required<FormGroup<ControlsOf<RedisProductFormControls>>>()
  isLoadingSubmit = input.required<boolean>();
  onSubmit = output<void>()
  onClose = output<void>();
  title = input.required<string>()
}
