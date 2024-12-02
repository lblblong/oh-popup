import { watchEffect } from 'vue'
import { useController } from './useController'

export function useSetResult(result?: unknown) {
  const ctl = useController()
  watchEffect(() => {
    ctl?.setResult(result)
  })
}
