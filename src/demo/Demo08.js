import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'
import {
  createVertexList,
  createRotateZMatrix,
  createScaleMatrix,
  createTranslateMatrix
} from './util'
import { combineLatest, concat } from 'rxjs'
import { of, map, take, tap, mapTo } from 'rxjs/operators'
import { Spring, SpringSubject } from '../spring'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      varying vec4 v_Color;
      void main() {
        gl_Position = a_Position;
        gl_PointSize = 3.0;
        v_Color = a_Color;
      }
    `

    let FSHADER_SOURCE = `
      precision mediump float;
      varying vec4 v_Color;
      void main() {
        gl_FragColor = v_Color;
      }
    `

    let isSuccess = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

    if (!isSuccess) {
      throw new Error('failed to initilize shaders')
    }

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    let a_Color = gl.getAttribLocation(gl.program, 'a_Color')

    let vertexList = createVertexList([
      [[0.0, 0.5], [1.0, 0.0, 0.0]],
      [[-0.5, -0.5], [0.0, 1.0, 0.0]],
      [[0.5, -0.5], [0.0, 0.0, 1.0]]
    ])
    let FSIZE = vertexList.BYTES_PER_ELEMENT

    let buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexList, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    gl.enableVertexAttribArray(a_Color)

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
