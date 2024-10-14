import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import DebugButton from './ui/DebugButton.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*ReactDOM.createRoot(document.getElementById('debug-panel')!).render(
  <React.StrictMode>
    <DebugButton />
  </React.StrictMode>,
)*/
