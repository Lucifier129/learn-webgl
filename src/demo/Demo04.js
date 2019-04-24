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
      attribute float a_PointSize;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
      }
    `

    let FSHADER_SOURCE = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `

    let isSuccess = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

    if (!isSuccess) {
      throw new Error('failed to initilize shaders')
    }

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    let u_color = gl.getUniformLocation(gl.program, 'u_color')

    if (a_Position < 0 || a_PointSize < 0 || !u_color) {
      throw new Error('failed to get attribute location from webgl')
    }

    let getColor = ([x, y]) => {
      if (x >= 0 && y >= 0) {
        return [1.0, 0.0, 0.0, 1.0]
      }

      if (x < 0 && y >= 0) {
        return [0.0, 1.0, 0.0, 1.0]
      }

      if (x < 0 && y < 0) {
        return [0.0, 0.0, 1.0, 1.0]
      }

      return [Math.random(), Math.random(), Math.random(), 1.0]
    }

    let pointList = []
    let handleClick = event => {
      let position = getPosition(canvas, event)
      let color = getColor(position)
      pointList.push({ position, color })
      render()
    }
    let handleDoubleClick = () => {
      pointList = []
      render()
    }

    let render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      pointList.forEach(({ position, color }) => {
        let [x, y] = position

        gl.vertexAttrib3f(a_Position, x, y, 0)
        gl.vertexAttrib1f(a_PointSize, 10)
        gl.uniform4fv(u_color, color)
        gl.drawArrays(gl.POINTS, 0, 1)
      })
    }

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    canvas.addEventListener('click', handleClick, false)
    canvas.addEventListener('dblclick', handleDoubleClick, false)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
