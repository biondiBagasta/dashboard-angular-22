import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

@Component({
  selector: 'confirmation-dialog',
  imports: [
    TuiButton,
    TuiAvatar
  ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialog {
  title = input.required<string>()
  message = input.required<string>()

  onSubmit = output<void>()
  onCancel = output<void>();
}
