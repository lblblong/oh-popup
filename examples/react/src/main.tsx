import { PopupManager } from 'oh-popup'
import { ManagerProvider } from 'oh-popup-react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

export const popupManager = new PopupManager()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ManagerProvider manager={popupManager} />
    <App />
  </>
)
