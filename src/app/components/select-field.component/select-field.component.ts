import { ChangeDetectionStrategy, Component, input  } from '@angular/core';
import { formValidationErrorProvider } from '../../../utils/utils';
import { TuiDataList, TuiDropdown, TuiError, TuiFilterByInputPipe } from '@taiga-ui/core';
import { TuiChevron, TuiComboBox, TuiDataListWrapper, TuiSelect } from '@taiga-ui/kit';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectItem } from '../../interfaces/select-item';
import { TuiStringHandler, } from '@taiga-ui/cdk/types';

@Component({
  selector: 'select-field-component',
  imports: [
    TuiError,
    ReactiveFormsModule,
    TuiChevron,
    TuiDropdown,
    TuiDataListWrapper,
    TuiSelect,
    TuiDataList,
    TuiFilterByInputPipe,
    TuiComboBox
  ],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    formValidationErrorProvider,
  ]
})
export class SelectFieldComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  items = input.required<SelectItem[]>()
  control = input.required<FormControl<SelectItem | null>>()

  icon = input("")

  protected stringify: TuiStringHandler<SelectItem> = (item) => item.name;

}
