import { Popup, PopupManager } from 'oh-popup'
import RootSliblingsManager from 'react-native-root-siblings'
import { PopupProvider } from './components/PopupProvider'
import { ManagerContext } from './context'

export const registerManager = (manager: PopupManager) => {
  const listener = (_popups: Popup[]) => {
    for (const popup of _popups) {
      if (popup['_slibling']) return
      popup['_slibling'] = new RootSliblingsManager(
        (
          <ManagerContext.Provider value={manager}>
            <PopupProvider popup={popup} />
          </ManagerContext.Provider>
        )
      )
      const originOnClosed = popup.onClosed
      popup.onClosed = function () {
        originOnClosed?.bind(this)()
        popup['_slibling'].destroy()
      }
    }
  }

  manager.on('change', listener as any)
}

