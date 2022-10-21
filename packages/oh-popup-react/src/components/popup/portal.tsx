import { FC, ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  children: ReactNode
  node?: HTMLElement
}

export const Portal: FC<PortalProps> = ({ node, children }: PortalProps) => {
  const defaultNodeRef = useRef<HTMLElement>()

  useEffect(
    () => () => {
      if (defaultNodeRef.current) {
        document.body.removeChild(defaultNodeRef.current)
      }
    },
    []
  )

  if (!node && !defaultNodeRef.current) {
    const defaultNode = (defaultNodeRef.current = document.createElement('div'))
    defaultNode.className = 'oh-popup__portal'
    document.body.appendChild(defaultNode)
  }

  return createPortal(children, (node || defaultNodeRef.current)!)
}
