import clsx from 'clsx'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import './index.scss'
import { Portal } from './portal'
import { Position } from './type'

const prefixCls = 'oh-popup'

const animations = {
  center: `${prefixCls}-fade`,
  left: `${prefixCls}-slide-right`,
  top: `${prefixCls}-slide-down`,
  right: `${prefixCls}-slide-left`,
  bottom: `${prefixCls}-slide-up`,
}

export interface PopupProps {
  visible: boolean
  position?: Position
  duration?: number
  zIndex?: number
  mask?: boolean | number
  maskClosable?: boolean
  onClose?: () => void
  onClosed?: () => void
  onOpened?: () => void
  destroyOnClose?: boolean
  children?: React.ReactNode
  transition?: string
  className?: string
  maskClass?: string
  maskStyle?: React.CSSProperties
  style?: React.CSSProperties
  node?: HTMLElement
}

export function Popup(props: PopupProps) {
  const {
    visible = false,
    position = 'bottom',
    mask = true,
    duration = 300,
    zIndex = 999,
    onClose,
    maskClosable = false,
    destroyOnClose = false,
    children,
    transition,
    maskClass,
    node,
    className,
    onClosed,
    onOpened,
    style,
    maskStyle,
  } = props

  const containerRef = React.useRef<HTMLDivElement>(null)

  const onMaskClick = () => {
    if (maskClosable) onClose()
  }

  const renderMask = () => {
    if (mask === false) return null

    const opacity = mask === true ? 0.73 : mask

    const maskCls = clsx(`${prefixCls}-mask`, maskClass)

    return (
      <CSSTransition
        in={visible}
        timeout={duration}
        classNames={`${prefixCls}-fade`}
        unmountOnExit={destroyOnClose}
        appear
      >
        <div
          className={maskCls}
          style={{
            zIndex,
            transitionDuration: `${duration}ms`,
            background: `rgba(0, 0, 0, ${opacity})`,
            ...maskStyle,
          }}
          onClick={onMaskClick}
        ></div>
      </CSSTransition>
    )
  }

  const renderPopup = () => {
    const popupCls = clsx(prefixCls, `${prefixCls}--${position}`, className)

    return (
      <CSSTransition
        in={visible}
        timeout={duration}
        classNames={transition || animations[position]}
        unmountOnExit={destroyOnClose}
        appear
        onEntered={onOpened}
        onExited={onClosed}
      >
        <div
          className={popupCls}
          style={{
            zIndex,
            transitionDuration: `${duration}ms`,
            ...style,
          }}
          ref={containerRef}
          onClick={(e) => {
            if (e.target === containerRef.current) onMaskClick()
          }}
        >
          {children}
        </div>
      </CSSTransition>
    )
  }

  return (
    <Portal node={node}>
      {renderMask()}
      {renderPopup()}
    </Portal>
  )
}
