import { Popup, PopupManager } from 'oh-popup'
import { FC, useEffect, useState } from 'react'
import { ManagerContext } from '../context'
import { useUpdate } from '../hooks/useUpdate'
import { PopupProvider } from './PopupProvider'

export interface PopupProviderProps {
  manager: PopupManager
}

export const ManagerProvider: FC<PopupProviderProps> = ({ manager }) => {
  const [popups, setPopups] = useState<Popup[]>([])
  const update = useUpdate()

  useEffect(() => {
    const listener = (_popups: Popup[]) => {
      setPopups(_popups)
      update()
    }
    manager.on('change', listener as any)
    return () => manager.off('change', listener as any)
  }, [])

  return (
    <ManagerContext.Provider value={manager}>
      {popups.map((popup) => (
        <PopupProvider key={popup.key} popup={popup} />
      ))}
    </ManagerContext.Provider>
  )
}
