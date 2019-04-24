import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'
import { getPosition } from './util'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      attribute vec4 a_Position;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = 3.0;
      }
    `

    let FSHADER_SOURCE = `
      void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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

    let vertexList = new Float32Array(
      [
        [-0.5, 0.5],
        [-0.3, -0.5],
        [0.0, 0.5],
        [0.2, -0.5],
        [0.5, 0.5],
        [0.7, -0.5]
      ].flat()
    )
    let buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexList, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    let count = 0
    let modeList = [
      gl.POINTS,
      gl.LINES,
      gl.LINE_STRIP,
      gl.TRIANGLES,
      gl.TRIANGLE_STRIP,
      gl.TRIANGLE_FAN
    ]
    let getMode = () => {
      return modeList[count++ % modeList.length]
    }
    setInterval(() => {
      let mode = getMode()
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(mode, 0, 6)
    }, 1000)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
