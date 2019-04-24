import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute float a_PointSize;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
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
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

    if (a_Position < 0 || a_PointSize < 0) {
      throw new Error('failed to get attribute location from webgl')
    }

    let render = (position, pointSize = 10) => {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.vertexAttrib3f(a_Position, ...position)
      gl.vertexAttrib1f(a_PointSize, pointSize)
      gl.drawArrays(gl.POINTS, 0, 1)
    }

    render([0, 0, 0])

    let count = 0
    setInterval(() => {
      let angle = (count / 180) * Math.PI * 20
      let x = Math.sin(angle) / 4
      let y = Math.cos(angle) / 4

      count = (count + 1) % 360
      render([x, y, 0])
    }, 1000 / 60)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
