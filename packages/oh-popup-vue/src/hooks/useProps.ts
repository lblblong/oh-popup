import { Popup } from 'oh-popup'
import { inject } from 'vue'
import { PopupContext } from '../context'

export function useProps<P = any>(): P {
  const popup = inject<Popup>(PopupContext)
  return popup?.props ?? {}
}
