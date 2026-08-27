import { Provider } from "@angular/core";
import { FormControl } from "@angular/forms";
import { maskitoTransform } from "@maskito/core";
import { maskitoNumber } from "@maskito/kit";
import { TUI_VALIDATION_ERRORS } from "@taiga-ui/core";

export const baseUrl = "http://localhost:8081/api";

export const formValidationErrorProvider: Provider =  {
  provide: TUI_VALIDATION_ERRORS,
  useFactory: () => ({
    required: "*This field is required."
  })
}

export type ControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export const maskitoCurrencyOptions = maskitoNumber({
  locale: "id-ID",
  min: 0,
  prefix: 'Rp. ',
});

export const maskitoPercentOptions = maskitoNumber({
    postfix: "%",
    min: 0,
    max: 100,
});

export function formatCurrencyMaskito(value: number): string {
  return maskitoTransform(value.toString(), maskitoCurrencyOptions)
}

export function formatPercentMaskito(value: number): string {
  return maskitoTransform(value.toString(), maskitoPercentOptions)
}

export function deformatToNumber(value: string): number {
  return Number(value.replaceAll(/[^0-9]/g, ""))
}
