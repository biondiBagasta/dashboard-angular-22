import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInput } from '@taiga-ui/core';

@Component({
  selector: 'input-search-component',
  imports: [
    TuiInput,
    ReactiveFormsModule
  ],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputSearchComponent {
  label = input.required<string>();
  placeholder = input.required<string>();

  control = input.required<FormControl>();

  onEnter = output<void>()
}
