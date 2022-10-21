import React from 'react'
import { ManagerContext } from '../context'

export function useManager() {
  return React.useContext(ManagerContext)
}
