import { Popup } from 'oh-popup'
import { inject } from 'vue'
import { PopupContext } from '../context'

export const useController = () => {
  return inject<Popup>(PopupContext)?.controller
}
