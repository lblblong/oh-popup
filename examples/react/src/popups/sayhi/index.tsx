import { useController } from 'oh-popup-react'
import { popupManager } from '../../main'
import styles from './index.module.scss'

interface SayHiProps {
  name: string
}

export const SayHi = ({ name }: SayHiProps) => {
  const { close, onlyClose } = useController()

  return (
    <div className={styles.index}>
      <h1> Hello there, {name}</h1>
      <button onClick={() => close(`hello`)}>Reply politely</button>
      <button
        onClick={() => close(new Error(`The ${name} refused to socialize`))}
      >
        Refuse social
      </button>
      <button onClick={() => onlyClose()}>Nothing happened</button>
    </div>
  )
}

export function openSayHi(props: SayHiProps, zIndex = 100) {
  return popupManager.open({
    el: <SayHi {...props} />,
    position: 'bottom',
    zIndex,
  })
}
