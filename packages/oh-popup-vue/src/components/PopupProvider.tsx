import clsx from 'clsx'
import { Popup } from 'oh-popup'
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  provide,
  shallowRef,
} from 'vue'
import { PopupContext } from '../context'
import { Popup as PopupComponent } from './popup'

export interface PopupProviderProps {
  popup: Popup
}

export const PopupProvider = defineComponent({
  name: 'PopupProvider',
  props: {
    popup: {
      type: Object as () => Popup,
      required: true,
    },
  },
  setup(props) {
    const popup = shallowRef({ ...props.popup })

    onBeforeMount(() => {
      props.popup.updateState('beforeMount')
      const listener = () => {
        popup.value = { ...props.popup }
      }

      props.popup.on('change', listener)
      onUnmounted(() => props.popup.off('change', listener))
    })

    onMounted(() => {
      props.popup.updateState('mounted')
    })

    provide(PopupContext, props.popup)

    return () => (
      <PopupComponent
        visible={popup.value.visible}
        position={popup.value.position}
        duration={popup.value.duration}
        zIndex={popup.value.zIndex}
        mask={popup.value.mask}
        maskClosable={popup.value.maskClosable}
        transition={popup.value.transition}
        className={clsx(popup.value.className, popup.value.key)}
        maskClass={popup.value.maskClass}
        onOpened={() => popup.value.callbacks.onOpened?.()}
        onClose={popup.value.onClose}
        onClosed={popup.value.onClosed}
      >
        {popup.value.el}
      </PopupComponent>
    )
  },
})
