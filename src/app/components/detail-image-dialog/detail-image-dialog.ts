import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { baseUrl } from '../../../utils/utils';

@Component({
  selector: 'detail-image-dialog',
  imports: [

  ],
  templateUrl: './detail-image-dialog.html',
  styleUrl: './detail-image-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailImageDialog {
  fileUrl = `${baseUrl}/files`

  imageUrl = input.required<string>()
}
