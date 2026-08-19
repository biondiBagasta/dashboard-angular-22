import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { TuiButton, TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'delete-dialog',
  imports: [
    TuiButton,
    TuiLoader
  ],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialog {
  title = input.required<string>()
  description = input.required<string>()
  isLoadingSubmit = model.required<boolean>()
  onSubmit = output<void>()
  onClose = output<void>()
}
