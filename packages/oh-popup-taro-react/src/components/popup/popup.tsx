import { View } from '@tarojs/components'
import clsx from 'clsx'
import React, { FC } from 'react'
import { Transition } from '../transition'
import './index.scss'
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
}

export const Popup: FC<PopupProps> = props => {
  const {
    visible,
    position,
    duration,
    zIndex,
    onClose,
    destroyOnClose,
    children,
    transition,
  } = props

  const renderMask = () => {
    if (props.mask === false) return null

    const opacity = props.mask === true ? 0.73 : props.mask

    const onMaskClick = () => {
      if (props.maskClosable) onClose()
    }

    const maskCls = clsx(`${prefixCls}-mask`, props.maskClass)

    return (
      <Transition
        in={visible}
        classNames={`${prefixCls}-fade`}
        unmountOnExit={destroyOnClose}
      >
        <View
          className={maskCls}
          style={{
            zIndex,
            transitionDuration: `${duration}ms`,
            background: `rgba(0, 0, 0, ${opacity})`,
            ...props.maskStyle,
          }}
          onClick={onMaskClick}
        ></View>
      </Transition>
    )
  }

  const renderPopup = () => {
    const popupCls = clsx(
      prefixCls,
      `${prefixCls}--${position}`,
      props.className
    )

    return (
      <Transition
        in={visible}
        classNames={transition || animations[position]}
        unmountOnExit={destroyOnClose}
        onEntered={props.onOpened}
        onExited={props.onClosed}
      >
        <View
          className={popupCls}
          style={{
            zIndex,
            transitionDuration: `${duration}ms`,
            ...props.style,
          }}
        >
          {children}
        </View>
      </Transition>
    )
  }

  return (
    <>
      {renderMask()}
      {renderPopup()}
    </>
  )
}

Popup.defaultProps = {
  visible: false,
  duration: 300,
  zIndex: 999,
  mask: true,
  position: 'bottom',
  destroyOnClose: false,
  maskClosable: false,
}
