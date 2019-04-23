import React, { useEffect, useRef } from 'react'
import { getWebGLContext } from '../lib/cuon-utils'

export default function Demo01() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    setInterval(() => {
      gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }, 1000)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
