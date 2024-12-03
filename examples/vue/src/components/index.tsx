import { popupManager } from '../manager'
import Sayhi from './el'

export function openSayhi() {
  return popupManager.open({
    el: <Sayhi />,
    position: 'center',
    maskClosable: true,
    // duration: 5000,
  })
}
