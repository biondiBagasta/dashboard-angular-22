import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { InputTextComponent } from '../../../../components/input-text.component/input-text.component';
import { TextareaFieldComponent } from '../../../../components/textarea-field.component/textarea-field.component';
import { ControlsOf } from '../../../../../utils/utils';
import { SupplierFormControls } from '../supplier-section';
import { ToggleFieldComponent } from "../../../../components/toggle-field.component/toggle-field.component";

@Component({
  selector: 'app-supplier-form',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiLoader,
    InputTextComponent,
    TextareaFieldComponent,
    ToggleFieldComponent
],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierForm {
  formGroup = input.required<FormGroup<ControlsOf<SupplierFormControls>>>()
  isLoadingSubmit = input.required<boolean>();
  onSubmit = output<void>()
  onClose = output<void>();
  title = input.required<string>()
}
