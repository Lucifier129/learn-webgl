import React, { useEffect, useRef } from 'react'
import { getWebGLContext, initShaders } from '../lib/cuon-utils'
import {
  createVertexList,
  createRotateZMatrix,
  createScaleMatrix,
  createTranslateMatrix
} from './util'
import { combineLatest, concat } from 'rxjs'
import { map, take, tap, mapTo } from 'rxjs/operators'
import { Spring, SpringSubject } from '../spring'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = getWebGLContext(canvas)

    let VSHADER_SOURCE = `
      attribute vec4 a_Position;
      uniform mat4 u_rotateZMatrix;
      uniform mat4 u_translateMatrix;
      uniform mat4 u_scaleMatrix;
      void main() {
        gl_Position = u_rotateZMatrix * u_translateMatrix * u_scaleMatrix * a_Position;
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
    let u_rotateZMatrix = gl.getUniformLocation(gl.program, 'u_rotateZMatrix')
    let u_translateMatrix = gl.getUniformLocation(
      gl.program,
      'u_translateMatrix'
    )
    let u_scaleMatrix = gl.getUniformLocation(gl.program, 'u_scaleMatrix')

    let vertexList = createVertexList([[0.0, 0.5], [-0.5, -0.5], [0.5, -0.5]])

    let buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexList, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.clearColor(0, 0, 0, 1)

    let subject = SpringSubject(1, 1)
    let rotate$ = subject.pipe(
      map(n => createRotateZMatrix(n * 360))
    )
    let translate$ = subject.pipe(
      map(x => createTranslateMatrix(x / 2))
    )
    let scale$ = subject.pipe(
      map(scale => createScaleMatrix(scale, scale, scale))
    )
    let data$ = combineLatest([subject, rotate$, translate$, scale$])

    data$.subscribe(([value, rotate, translate, scale]) => {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniformMatrix4fv(u_rotateZMatrix, false, rotate)
      gl.uniformMatrix4fv(u_translateMatrix, false, translate)
      gl.uniformMatrix4fv(u_scaleMatrix, false, scale)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)

      if (value === 0) subject.next(1)
      if (value === 1) subject.next(0)
    })
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}