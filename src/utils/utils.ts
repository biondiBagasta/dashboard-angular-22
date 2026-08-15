import { Provider } from "@angular/core";
import { TUI_VALIDATION_ERRORS } from "@taiga-ui/core";

export const formValidationErrorProvider: Provider =  {
  provide: TUI_VALIDATION_ERRORS,
  useFactory: () => ({
    required: "*This field is required."
  })
}
