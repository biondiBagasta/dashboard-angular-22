import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'
import { formValidationErrorProvider } from '../../../utils/utils';
import { TuiError } from '@taiga-ui/core';

@Component({
  selector: 'quill-field-component',
  imports: [
    QuillModule,
    ReactiveFormsModule,
    TuiError
  ],
  templateUrl: './quill-field.component.html',
  styleUrl: './quill-field.component.css',
  providers: [
    formValidationErrorProvider
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuillFieldComponent {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  label = input.required<string>()
  control = input.required<FormControl<string | null>>()
}
