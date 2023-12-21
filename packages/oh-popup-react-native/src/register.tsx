import { Popup, PopupManager } from 'oh-popup'
import RootSliblingsManager from 'react-native-root-siblings'
import { PopupProvider } from './components/PopupProvider'
import { ManagerContext } from './context'

export const registerManager = (manager: PopupManager) => {
  const onNewPopup = (popup: Popup) => {
    popup['_slibling'] = new RootSliblingsManager(
      (
        <ManagerContext.Provider value={manager}>
          <PopupProvider popup={popup} />
        </ManagerContext.Provider>
      )
    )
  }

  const onDestroyPopup = (popup: Popup) => {
    popup['_slibling'].destroy()
  }

  manager.on('new-popup', onNewPopup)
  manager.on('destroy-popup', onDestroyPopup)
}
