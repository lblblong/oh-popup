export type Position = 'left' | 'right' | 'bottom' | 'top' | 'center'

export interface PopupController {
  close(result?: unknown): void
  onlyClose(): void
  onClosed(cb: () => void): void
  setResult(result?: unknown): void
}

export type PopupState =
  | 'created'
  | 'beforeMount'
  | 'mounted'
  | 'beforeUnmount'
  | 'unmounted'

export type AugmentedRequired<
  T extends object,
  K extends keyof T = keyof T
> = Omit<T, K> & Required<Pick<T, K>>
