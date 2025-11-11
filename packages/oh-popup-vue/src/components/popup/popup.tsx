import clsx from 'clsx'
import { defineComponent, ref, Transition } from 'vue'
import './index.css'
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
  transition?: string
  className?: string
  maskClass?: string
  maskStyle?: Record<string, any>
  style?: Record<string, any>
  node?: HTMLElement
}

export const Popup = defineComponent({
  name: 'Popup',
  props: {
    visible: { type: Boolean, default: false },
    position: { type: String as () => Position, default: 'bottom' },
    mask: { type: [Boolean, Number], default: true },
    duration: { type: Number, default: 300 },
    zIndex: { type: Number, default: 999 },
    onClose: { type: Function },
    maskClosable: { type: Boolean, default: false },
    destroyOnClose: { type: Boolean, default: false },
    transition: { type: String },
    maskClass: { type: String },
    node: { type: Object as () => HTMLElement },
    className: { type: String },
    onClosed: { type: Function },
    onOpened: { type: Function },
    style: { type: Object },
    maskStyle: { type: Object },
  },
  setup(props, { slots }) {
    const containerRef = ref<HTMLDivElement>()

    const onMaskClick = () => {
      if (props.maskClosable) props.onClose?.()
    }

    const renderMask = () => {
      if (props.mask === false) return null

      const opacity = props.mask === true ? 0.73 : props.mask

      const maskCls = clsx(`${prefixCls}-mask`, props.maskClass)

      return (
        <Transition name={`${prefixCls}-fade`} appear>
          {props.visible && (
            <div
              class={maskCls}
              style={{
                zIndex: props.zIndex,
                transitionDuration: `${props.duration}ms`,
                background: `rgba(0, 0, 0, ${opacity})`,
                ...props.maskStyle,
              }}
              onClick={onMaskClick}
            />
          )}
        </Transition>
      )
    }

    const renderPopup = () => {
      const popupCls = clsx(
        prefixCls,
        `${prefixCls}--${props.position}`,
        props.className
      )

      return (
        <Transition
          name={props.transition || animations[props.position]}
          appear
          onAfterEnter={() => props.onOpened?.()}
          onAfterLeave={() => props.onClosed?.()}
        >
          {props.visible && (
            <div
              class={popupCls}
              style={{
                zIndex: props.zIndex,
                transitionDuration: `${props.duration}ms`,
                ...props.style,
              }}
              ref={containerRef}
              onClick={(e) => {
                if (e.target === containerRef.value) onMaskClick()
              }}
            >
              {slots.default?.()}
            </div>
          )}
        </Transition>
      )
    }

    return () => (
      <Portal node={props.node}>
        {renderMask()}
        {renderPopup()}
      </Portal>
    )
  },
})
