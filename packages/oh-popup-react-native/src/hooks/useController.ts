import React from 'react'
import { ControllerContext } from '../context'

export const useController = () => {
  return React.useContext(ControllerContext)
}
