import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import demos from './demo'

const App = () => {
  let [index, setIndex] = useState(-1)
  let Demo = demos[index]

  useEffect(() => {
    let handleHashChange = () => {
      let hash = Number(location.hash)
      if (!isNaN(hash)) {
        setIndex(hash)
      } else {
        location.hash = 0
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (!Demo) return
  return <Demo />
}

ReactDOM.render(<App />, document.getElementById('root'))
