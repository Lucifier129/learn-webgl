import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 10.0;
      }
    `

    let FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `

    let isSuccess = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
    if (!isSuccess) throw new Error('initilize shaders failed')

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
