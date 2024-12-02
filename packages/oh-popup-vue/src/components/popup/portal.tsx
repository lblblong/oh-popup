import { defineComponent, onUnmounted, ref, Teleport } from 'vue'

export interface PortalProps {
  node?: HTMLElement
}

export const Portal = defineComponent({
  props: {
    node: {
      type: Object as () => HTMLElement | undefined,
      required: false,
    },
  },
  setup(props, { slots }) {
    const defaultNodeRef = ref<HTMLElement>()

    onUnmounted(() => {
      if (defaultNodeRef.value) {
        document.body.removeChild(defaultNodeRef.value)
      }
    })

    if (!props.node && !defaultNodeRef.value) {
      const defaultNode = (defaultNodeRef.value = document.createElement('div'))
      defaultNode.className = 'oh-popup__portal'
      document.body.appendChild(defaultNode)
    }

    return () => (
      <Teleport to={props.node || defaultNodeRef.value!}>
        {slots.default?.()}
      </Teleport>
    )
  },
})
