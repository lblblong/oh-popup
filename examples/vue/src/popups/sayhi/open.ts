import { popupManager } from '../../shared/provider'
import SayHi from './index.vue'

export const openSayHi = () => {
  popupManager.open({
    el: SayHi,
    position: 'bottom',
    duration: 3000,
  })
}
