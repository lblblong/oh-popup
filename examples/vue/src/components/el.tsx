import { defineComponent } from 'vue'
import styles from './index.module.scss'
import { useController } from 'oh-popup-vue'

export default defineComponent({
  setup() {
    const ctl = useController()

    return () => (
      <div class={styles.index}>
        <div>弹出层</div>
        <button onClick={() => ctl?.close()}>关闭</button>
        <button onClick={() => ctl?.close(123)}>关闭并返回值</button>
        <button onClick={() => ctl?.close({ name: '34234' })}>
          关闭并返回值2
        </button>
      </div>
    )
  },
})
