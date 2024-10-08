import mitt, { Handler } from 'mitt'
import { Popup } from './popup'

const isWeb = typeof window !== 'undefined' && window.document

type PopupManagerOptions = Partial<
  Pick<Popup, 'mask' | 'zIndex' | 'maskClosable' | 'duration' | 'callbackWhen'>
>

export class PopupManager {
  private count = 0
  event = mitt()

  constructor(private opts: PopupManagerOptions = {}) {
    if (isWeb) {
      window.document.addEventListener('keyup', (e) => {
        if (e.key !== 'Escape') return
        if (this.popups.length === 0) return

        const top = this.popups.reduce((pre, cur) => {
          return cur.zIndex > pre.zIndex ? cur : pre
        }, this.popups[this.popups.length - 1])

        if (top.keyboard) this.close(top.key)
      })
    }
  }

  private popups: (Popup & {
    props?: any
  })[] = []

  open = <T = any>(
    opts: Required<Pick<Popup, 'el'>> &
      Partial<
        Pick<
          Popup,
          | 'key'
          | 'position'
          | 'mask'
          | 'zIndex'
          | 'maskClosable'
          | 'duration'
          | 'callbackWhen'
          | 'className'
          | 'props'
          | 'maskClass'
          | 'keyboard'
        >
      > & {
        onClose?: () => void
        onOpened?: () => void
        onClosed?: () => void
      }
  ) => {
    return new Promise<T | undefined>((resolve, reject) => {
      if (opts.key && this.includes(opts.key)) {
        throw Error(`The key "${opts.key}" already exists`)
      }

      opts = Object.assign({}, this.opts, opts)

      this.count++

      const newPopup = new Popup({
        manager: this,
        key: opts.key || `oh-popup-item-id__${this.count}`,
        el: opts.el,
        props: opts.props,
        position: opts.position,
        duration: opts.duration,
        mask: opts.mask,
        zIndex: opts.zIndex,
        maskClosable: opts.maskClosable,
        maskClass: opts.maskClass,
        className: opts.className,
        promise: {
          resolve,
          reject,
        },
        callbackWhen: opts.callbackWhen,
        callbacks: {
          onClose: opts.onClose,
          onClosed: opts.onClosed,
          onOpened: opts.onOpened,
        },
      })

      this.popups.push(newPopup)
      this.event.emit('new-popup', newPopup)
      this.emitChange()
    })
  }

  close = (key: string, result?: unknown) => {
    this.popups.find((popup) => popup.key === key)?.controller.close(result)
  }

  closeAll = () => {
    this.popups.forEach((it) => it.controller.close())
  }

  destroy = (key: string) => {
    let index = -1
    for (let i = 0; i < this.popups.length; i++) {
      if (this.popups[i].key !== key) continue
      index = i
      break
    }
    if (index === -1) return

    const popup = this.popups[index]
    this.popups.splice(index, 1)
    this.event.emit('destroy-popup', popup)
    this.emitChange()
  }

  includes = (key: string) => {
    let index = -1
    for (let i = 0; i < this.popups.length; i++) {
      if (this.popups[i].key !== key) continue
      index = i
      break
    }
    return index !== -1
  }

  on = (type: string, handler: Handler) => {
    this.event.on(type, handler)
  }

  off = (type: string, handler?: Handler) => {
    this.event.off(type, handler)
  }

  private emitChange = () => {
    this.event.emit('change', this.popups)
  }
}
