import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlsOf } from '../../../../utils/utils';
import { ProductFormControls } from '../product-page';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { InputTextComponent } from '../../../components/input-text.component/input-text.component';
import { InputNumberComponent } from '../../../components/input-number.component/input-number.component';
import { InputCurrencyComponent } from '../../../components/input-currency.component/input-currency.component';
import { InputPercentComponent } from '../../../components/input-percent.component/input-percent.component';
import { SelectFieldComponent } from '../../../components/select-field.component/select-field.component';
import { QuillFieldComponent } from '../../../components/quill-field.component/quill-field.component';
import { InputFileComponent } from '../../../components/input-file.component/input-file.component';
import { SelectItem } from '../../../interfaces/select-item';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    TuiLoader,
    TuiButton,
    InputTextComponent,
    InputNumberComponent,
    InputCurrencyComponent,
    InputPercentComponent,
    SelectFieldComponent,
    QuillFieldComponent,
    InputFileComponent
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  formGroup = input.required<FormGroup<ControlsOf<ProductFormControls>>>()
  isLoadingSubmit = input.required<boolean>();
  onSubmit = output<void>()
  onClose = output<void>();
  title = input.required<string>()
  categoryList = input.required<SelectItem[]>()
}
