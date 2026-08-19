import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { InputTextComponent } from '../../../../components/input-text.component/input-text.component';
import { ControlsOf } from '../../../../../utils/utils';
import { CategoryFormControls } from '../category-section';

@Component({
  selector: 'app-category-form',
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    TuiButton,
    TuiLoader
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryForm {
  formGroup = input.required<FormGroup<ControlsOf<CategoryFormControls>>>()
  isLoadingSubmit = model.required<boolean>();
  onSubmit = output<void>()
  onClose = output<void>();
  title = input.required<string>()
}
