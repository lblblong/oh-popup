import clsx from 'clsx'
import { Popup } from 'oh-popup'
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  provide,
  ref,
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
    const update = ref(0)

    onBeforeMount(() => {
      props.popup.updateState('beforeMount')

      const listener = () => {
        update.value++
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
        visible={props.popup.visible}
        position={props.popup.position}
        duration={props.popup.duration}
        zIndex={props.popup.zIndex}
        mask={props.popup.mask}
        maskClosable={props.popup.maskClosable}
        transition={props.popup.transition}
        className={clsx(props.popup.className, props.popup.key)}
        maskClass={props.popup.maskClass}
        onOpened={() => props.popup.callbacks.onOpened?.()}
        onClose={props.popup.onClose}
        onClosed={props.popup.onClosed}
      >
        {props.popup.el}
      </PopupComponent>
    )
  },
})
