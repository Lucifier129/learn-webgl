import React, { useState, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import demos from './demo'

const App = () => {
  let [index, setIndex] = useState(-1)
  let Demo = demos[index]

  useEffect(() => {
    let handleHashChange = () => {
      let hash = window.location.hash
      if (hash.length <= 1) {
        setIndex(-1)
        return
      }
      let targetIndex = Number(hash.slice(1).split('?')[0])
      if (!isNaN(targetIndex)) setIndex(targetIndex)
    }
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <>
      <div>
        <a href="#">首页</a>
      </div>
      <Suspense fallback={'loading...'}>{!!Demo && <Demo />}</Suspense>
      {!Demo &&
        demos.map((_, index) => {
          return (
            <div key={index}>
              <a href={`#${index}`}>demo {index + 1}</a>
            </div>
          )
        })}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
