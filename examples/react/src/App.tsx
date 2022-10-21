import { useState } from 'react'
import './App.css'
import { openSayHi } from './popups/sayhi'

function App() {
  const [name, setName] = useState('Murphy')

  return (
    <div className="App">
      <p>Please open DevTools</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />

      <button
        onClick={async () => {
          if (!name) return
          openSayHi({ name }, 999)
          const result = await openSayHi({ name })
          console.log(`${name} reply: `, result)
        }}
      >
        Say hello
      </button>
    </div>
  )
}

export default App
