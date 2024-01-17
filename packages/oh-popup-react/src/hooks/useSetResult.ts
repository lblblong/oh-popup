import { useEffect } from 'react'
import { useController } from './useController'

export function useSetResult(result?: unknown) {
  const ctl = useController()
  useEffect(() => {
    ctl.setResult(result)
  }, [ctl, result])
}
