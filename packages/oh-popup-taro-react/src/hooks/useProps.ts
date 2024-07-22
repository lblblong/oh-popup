import { useContext } from 'react'
import { PopupContext } from '../context'

export function useProps<P = any>(): P {
  const popup = useContext(PopupContext)
  return popup.props ?? {}
}
