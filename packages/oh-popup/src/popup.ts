import mitt, { Handler } from 'mitt'
import { isNil } from './func/isNil'
import { PopupManager } from './manager'
import {
  AugmentedRequired,
  PopupController,
  PopupState,
  Position,
} from './type'

export class Popup<T = any> {
  manager!: PopupManager

  visible = true
  key!: string
  el!: T
  position?: Position
  mask?: boolean | number
  zIndex!: number
  maskClosable?: boolean
  controller: PopupController
  state!: PopupState
  callbackWhen!: 'onClose' | 'onClosed'
  promise?: {
    reject: (reason?: any) => void
    resolve: (value?: any) => void
  }
  callbacks!: {
    onClose?: () => void
    onOpened?: () => void
    onClosed?: () => void
  }
  duration?: number
  transition?: string
  className?: string
  maskClass?: string
  keyboard!: boolean

  event = mitt()

  constructor(
    opts: AugmentedRequired<Partial<Popup>, 'key' | 'manager' | 'el'>
  ) {
    Object.assign(this, {
      ...opts,
      position: opts.position || 'bottom',
      mask: isNil(opts.mask) ? true : opts.mask,
      zIndex: opts.zIndex || 999,
      callbackWhen: opts.callbackWhen || 'onClose',
      maskClosable: isNil(opts.maskClosable) ? true : opts.maskClosable,
      keyboard: isNil(opts.keyboard) ? true : opts.keyboard,
      callbacks: opts.callbacks || {},
    })

    this.controller = {
      onlyClose: () => {
        this.emitBack = () => {}
        this.onClose()
      },
      close: (result?: unknown) => {
        if (result && result instanceof Error) {
          this.emitBack = () => this.promise?.reject(result)
        } else {
          this.emitBack = () => this.promise?.resolve(result)
        }
        this.onClose()
      },
      handleClosed: (cb) => {
        this.on('closed', cb)
      },
    }

    this.updateState('created')
  }

  emitBack = () => {
    this.promise?.resolve()
  }

  updateState = (newValue: PopupState) => {
    this.state = newValue
  }

  updateVisible = (newValue: boolean) => {
    this.visible = newValue
    this.emitChange()
  }

  onClose = () => {
    if (this.state === 'beforeUnmount') return

    this.callbacks.onClose?.()

    this.updateState('beforeUnmount')
    this.updateVisible(false)
    if (this.callbackWhen === 'onClose') {
      this.emit('closed')
      this.emitBack()
    }
  }

  onClosed = () => {
    this.callbacks.onClosed?.()
    this.updateState('unmounted')

    this.manager.destroy(this.key)
    if (this.callbackWhen === 'onClosed') {
      this.emit('closed')
      this.emitBack()
    }
  }

  emit = (type: string, event?: unknown) => {
    this.event.emit(type, event)
  }

  on = (type: string, handler: Handler) => {
    this.event.on(type, handler)
  }

  off = (type: string, handler?: Handler) => {
    this.event.off(type, handler)
  }

  private emitChange = () => {
    this.event.emit('change')
  }
}
