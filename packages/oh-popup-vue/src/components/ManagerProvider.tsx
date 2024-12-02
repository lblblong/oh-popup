import { Popup, PopupManager } from 'oh-popup'
import { defineComponent, onBeforeMount, onUnmounted, provide, ref } from 'vue'
import { ManagerContext } from '../context'
import { PopupProvider } from './PopupProvider'

export interface ManagerProviderProps {
  manager: PopupManager
}

export const ManagerProvider = defineComponent({
  name: 'ManagerProvider',
  props: {
    manager: {
      type: Object as () => PopupManager,
      required: true,
    },
  },
  setup(props) {
    const popups = ref<Popup[]>([])

    onBeforeMount(() => {
      const listener = (_popups: Popup[]) => {
        popups.value = _popups
      }
      props.manager.on('change', listener)
      onUnmounted(() => props.manager.off('change', listener))
    })

    provide(ManagerContext, props.manager)

    return () => (
      <>
        {popups.value.map((popup) => (
          <PopupProvider key={popup.key} popup={popup as any} />
        ))}
      </>
    )
  },
})
