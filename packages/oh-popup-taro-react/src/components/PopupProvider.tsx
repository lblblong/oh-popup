import clsx from 'clsx'
import { Popup } from 'oh-popup'
import { FC, useEffect, useLayoutEffect } from 'react'
import { PopupContext } from '../context'
import useUpdate from '../hooks/useUpdate'
import { Popup as PopupComponent } from './popup'

export interface PopupProviderProps {
  popup: Popup
}

export const PopupProvider: FC<PopupProviderProps> = ({ popup }) => {
  const update = useUpdate()

  useEffect(() => {
    popup.updateState('beforeMount')

    const lisenter = () => {
      update()
    }

    popup.on('change', lisenter)
    return () => popup.off('change', lisenter)
  }, [])

  useLayoutEffect(() => {
    popup.updateState('mounted')
  }, [])

  return (
    <PopupComponent
      visible={popup.visible}
      position={popup.position}
      duration={popup.duration}
      zIndex={popup.zIndex}
      mask={popup.mask}
      maskClosable={popup.maskClosable}
      transition={popup.transition}
      maskClass={popup.maskClass}
      className={clsx(popup.className, popup.key)}
      onOpened={() => popup.callbacks.onOpened?.()}
      onClose={popup.onClose}
      onClosed={popup.onClosed}
    >
      <PopupContext.Provider value={popup}>{popup.el}</PopupContext.Provider>
    </PopupComponent>
  )
}
