import React, { useEffect, useRef } from 'react'
import {} from 'gl-matrix'
import { loadImageList, glsl } from './util'
import skyImageSrc from './image/sky.jpg'
import circleImageSrc from './image/circle.gif'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = canvas.getContext('webgl')

    let VSHADER_SOURCE = glsl`
      attribute vec4 a_Position;
      attribute vec2 a_TexCoor;
      varying vec2 v_TexCoor;
      void main() {
        gl_Position = a_Position;
        v_TexCoor = a_TexCoor;
      }
    `

    let FSHADER_SOURCE = glsl`
      precision mediump float;
      varying vec2 v_TexCoor;
      uniform sampler2D u_Sampler0;
      uniform sampler2D u_Sampler1;
      void main() {
        vec4 color0 = texture2D(u_Sampler0, v_TexCoor);
        vec4 color1 = texture2D(u_Sampler1, v_TexCoor);
        gl_FragColor = color0 * color1;
      }
    `

    let { program } = makeProgram(VSHADER_SOURCE, FSHADER_SOURCE)({ gl })
    let aLocation = makeAttrLocation('a_Position', 'a_TexCoor')

    let vertexList = createVertexList([
      [[-0.5, 0.5], [0.0, 1.0]],
      [[-0.5, -0.5], [0.0, 0.0]],
      [[0.5, 0.5], [1.0, 1.0]],
      [[0.5, -0.5], [1.0, 0.0]]
    ])
    let FSIZE = vertexList.BYTES_PER_ELEMENT

    let buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexList, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_TexCoor, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_TexCoor)

    let initTexture = (image, unit, u_Sampler) => {
      let texture = gl.createTexture()

      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.activeTexture(gl[`TEXTURE${unit}`])
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.uniform1i(u_Sampler, unit)
    }

    let render = async () => {
      let imageSrcList = [skyImageSrc, circleImageSrc]
      let [skyImage, circleImage] = await loadImageList(imageSrcList)
      let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0')
      let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1')

      initTexture(skyImage, 0, u_Sampler0)
      initTexture(circleImage, 1, u_Sampler1)

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    render()
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}

const pipe = (...args) => args.reduce((a, f) => f(a))

const makeProgram = (vshaderSource, fshaderSource) => ({ gl, ...state }) => {
  let vshader = createShader(gl, gl.VERTEX_SHADER, vshaderSource)
  let fshader = createShader(gl, gl.FRAGMENT_SHADER, fshaderSource)
  let shader = { vshader, fshader }
  let program = createProgram(gl, shader)

  return {
    ...state,
    shader,
    program,
    gl
  }
}

const createProgram = (gl, shader) => {
  let program = gl.createProgram()

  gl.attachShader(program, shader.vshader)
  gl.attachShader(program, shader.fshader)
  gl.linkProgram(program)

  let message = gl.getProgramInfoLog(program)
  if (message) throw new Error(message)
  return program
}

const createShader = (gl, type, source) => {
  let shader = gl.createShader(type)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  let message = gl.getShaderInfoLog(shader)
  if (message) throw new Error(message)
  return shader
}

const mapListToObj = (list, f) => {
  return list.reduce((obj, name, index) => {
    obj[name] = f(name, index, obj)
    return obj
  }, {})
}

const makeAttrLocation = (...nameList) => ({ gl, program, ...state }) => {
  let aLocation = mapListToObj(nameList, name =>
    gl.getAttribLocation(program, name)
  )

  return {
    ...state,
    gl,
    program,
    aLocation
  }
}

const makeUniformLocation = (...nameList) => ({ gl, program, ...state }) => {
  let uLocation = mapListToObj(nameList, name =>
    gl.getUniformLocation(program, name)
  )

  return {
    ...state,
    gl,
    program,
    uLocation
  }
}
