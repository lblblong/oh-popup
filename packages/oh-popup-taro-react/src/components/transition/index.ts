import clsx from 'clsx'
import React, {
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { requestAnimationFrame } from '../../func/requestAnimationFrame'

interface TransitionProps {
  children: ReactNode
  classNames: string
  in: boolean
  unmountOnExit?: boolean
  onEntered?: () => void
  onExited?: () => void
}

export const Transition: FC<TransitionProps> = props => {
  const { children, classNames, unmountOnExit, onEntered, onExited } = props

  const [className, setClassName] = useState({})
  const [mount, setMount] = useState(props.in)

  const baseClass = useMemo(() => {
    if (props.in) {
      return { [classNames]: true, [classNames + '-enter']: true }
    } else {
      return { [classNames]: true, [classNames + '-exit']: true }
    }
  }, [classNames, props.in])

  useLayoutEffect(() => {
    if (props.in) {
      setMount(true)
      requestAnimationFrame(() => {
        setClassName({
          [classNames + '-enter-active']: true,
        })
      })
    } else {
      requestAnimationFrame(() => {
        setClassName({
          [classNames + '-exit-active']: true,
        })
      })
    }
  }, [props.in])

  const onTransitionEnd = useCallback(() => {
    if (props.in) {
      onEntered?.()
    } else {
      setMount(false)
      onExited?.()
    }
  }, [props.in])

  if (mount === false && unmountOnExit) return null

  return React.cloneElement(React.Children.only(children) as any, {
    className: clsx((children as any).props.className, baseClass, className),
    onTransitionEnd,
  })
}
