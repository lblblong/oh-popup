import { PopupManager } from 'oh-popup'
import { inject } from 'vue'
import { ManagerContext } from '../context'

export function useManager() {
  return inject<PopupManager>(ManagerContext)
}
