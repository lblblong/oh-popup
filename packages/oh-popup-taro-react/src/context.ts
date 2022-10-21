import { Popup, PopupController, PopupManager } from 'oh-popup'
import React from 'react'

export const ControllerContext = React.createContext<PopupController>(
  null as any
)
export const ManagerContext = React.createContext<PopupManager>(null as any)
export const PopupContext = React.createContext<Popup>(null as any)
