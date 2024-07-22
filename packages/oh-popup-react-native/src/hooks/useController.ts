import React from 'react'
import { PopupContext } from '../context'

export const useController = () => {
  return React.useContext(PopupContext)?.controller
}
