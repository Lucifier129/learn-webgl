import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      attribute vec4 a_Position;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
      }
    `

    let FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `

    let isSuccess = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

    if (!isSuccess) {
      throw new Error('failed to initilize shaders')
    }

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    if (a_Position < 0) {
      throw new Error('failed to get attribute location from webgl')
    }

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let count = 0
    setInterval(() => {
      let angle = (count / 180) * Math.PI
      let x = Math.sin(angle)
      let y = Math.cos(angle)

      count = (count + 1) % 360
      gl.vertexAttrib3f(a_Position, x, y, 0.0)
      gl.drawArrays(gl.POINTS, 0, 1)
    }, 1000 / 60)

    gl.vertexAttrib3f(a_Position, 0, 0, 0.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
