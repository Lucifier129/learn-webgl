import React, { useEffect, useRef, useState } from 'react'
import { mat4, vec3 } from 'gl-matrix'
import * as dat from 'dat.gui'
import { loadImageList, glsl, createVertexList } from './util'
import skyImageSrc from './image/sky.jpg'
import circleImageSrc from './image/circle.gif'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = canvas.getContext('webgl')
    gl.viewport(0, 0, canvas.width, canvas.height)
    renderItem(gl)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}

const raf = f => {
  let timer = null
  let render = () => {
    f()
    timer = requestAnimationFrame(render)
  }
  render()
  return () => cancelAnimationFrame(timer)
}

const renderItem = async gl => {
  let angle = 0
  let item = await makeItem(gl)
  return raf(() => {
    let radian = ((angle % 360) * Math.PI) / 180
    let axis = vec3.fromValues(0, 0, 1)
    let props = {
      radian,
      axis
    }

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    item.render(props)
    angle += 1
  })
}

const makeItem = async gl => {
  let VSHADER_SOURCE = glsl`
    attribute vec4 aPosition;
    attribute vec2 aTexCoor;
    uniform mat4 uRotateM;
    varying vec2 vTexCoor;
    void main() {
      gl_Position = uRotateM * aPosition;
      vTexCoor = aTexCoor;
    }
  `

  let FSHADER_SOURCE = glsl`
    precision mediump float;
    varying vec2 vTexCoor;
    uniform sampler2D uSampler0;
    uniform sampler2D uSampler1;
    void main() {
      vec4 color0 = texture2D(uSampler0, vTexCoor);
      vec4 color1 = texture2D(uSampler1, vTexCoor);
      gl_FragColor = color0 * color1;
    }
  `

  let program = makeProgram(gl, {
    vertex: VSHADER_SOURCE,
    fragment: FSHADER_SOURCE
  })

  let uniform = getUniform(gl, program)
  let attribute = getAttribute(gl, program)

  let vertexList = createVertexList([
    [[-0.5, 0.5], [0.0, 1.0]],
    [[-0.5, -0.5], [0.0, 0.0]],
    [[0.5, 0.5], [1.0, 1.0]],
    [[0.5, -0.5], [1.0, 0.0]]
  ])

  let FSIZE = vertexList.BYTES_PER_ELEMENT

  let VBO = makeVBO(gl, {
    type: gl.ARRAY_BUFFER,
    data: vertexList
  })

  enableAttributes(gl, gl.ARRAY_BUFFER, VBO, [
    {
      location: attribute.aPosition,
      size: 2,
      stride: FSIZE * 4,
      offset: 0
    },
    {
      location: attribute.aTexCoor,
      size: 2,
      stride: FSIZE * 4,
      offset: FSIZE * 2
    }
  ])

  let imageSrcList = [skyImageSrc, circleImageSrc]
  let [skyImage, circleImage] = await loadImageList(imageSrcList)

  let useProgram = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO)
    gl.useProgram(program)
  }

  let useTexture = () => {
    attachTexture2D(gl, {
      unit: 0,
      location: uniform.uSampler0,
      image: {
        source: skyImage,
        format: gl.RGBA,
        type: gl.UNSIGNED_BYTE
      },
      parameters: [
        {
          name: gl.TEXTURE_MIN_FILTER,
          value: gl.LINEAR
        }
      ]
    })

    attachTexture2D(gl, {
      unit: 1,
      location: uniform.uSampler1,
      image: {
        source: circleImage,
        format: gl.RGBA,
        type: gl.UNSIGNED_BYTE
      },
      parameters: [
        {
          name: gl.TEXTURE_MIN_FILTER,
          value: gl.LINEAR
        }
      ]
    })
  }

  let draw = () => {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let identityM = mat4.create()
  let rotateM = mat4.create()
  let rotate = async (radian, axis) => {
    mat4.rotate(rotateM, identityM, radian, axis)
    gl.uniformMatrix4fv(uniform.uRotateM, false, rotateM)
  }

  let render = props => {
    useProgram()
    useTexture()
    rotate(props.radian, props.axis)
    draw()
  }

  return { render }
}

const makeProgram = (gl, source) => {
  let vshader = createShader(gl, {
    type: gl.VERTEX_SHADER,
    source: source.vertex
  })
  let fshader = createShader(gl, {
    type: gl.FRAGMENT_SHADER,
    source: source.fragment
  })
  let program = createProgram(gl, {
    vertex: vshader,
    fragment: fshader
  })

  return program
}

const createProgram = (gl, shader) => {
  let program = gl.createProgram()

  gl.attachShader(program, shader.vertex)
  gl.attachShader(program, shader.fragment)
  gl.linkProgram(program)

  let message = gl.getProgramInfoLog(program)
  if (message) throw new Error(message)
  return program
}

const createShader = (gl, { type, source }) => {
  let shader = gl.createShader(type)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  let message = gl.getShaderInfoLog(shader)
  if (message) throw new Error(message)
  return shader
}

const makeVBO = (gl, { type, data, usage = gl.STATIC_DRAW }) => {
  let buffer = gl.createBuffer()
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, data, usage)
  // unbind
  gl.bindBuffer(type, null)
  return buffer
}

const enableAttributes = (gl, bufferType, VBO, args = []) => {
  gl.bindBuffer(bufferType, VBO)
  args.forEach(params => {
    let {
      location,
      size,
      type = gl.FLOAT,
      normalized = false,
      stride,
      offset
    } = params
    gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
    gl.enableVertexAttribArray(location)
  })
  gl.bindBuffer(bufferType, null)
}

const getUniform = (gl, program) => {
  let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  let uniform = {}
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i)
    uniform[info.name] = gl.getUniformLocation(program, info.name)
  }
  return uniform
}

const getAttribute = (gl, program) => {
  let count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
  let attribute = {}
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveAttrib(program, i)
    attribute[info.name] = gl.getAttribLocation(program, info.name)
  }
  return attribute
}

const attachTexture2D = (
  gl,
  { location, unit, image, flipY = true, parameters = [] }
) => {
  let texture = gl.createTexture()

  if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  parameters.forEach(({ name, value }) => {
    gl.texParameteri(gl.TEXTURE_2D, name, value)
  })

  image = {
    level: 0,
    format: gl.RGBA,
    type: gl.UNSIGNED_BYTE,
    ...image
  }

  gl.texImage2D(
    gl.TEXTURE_2D,
    image.level,
    image.format,
    image.format,
    image.type,
    image.source
  )

  gl.uniform1i(location, unit)

  return texture
}
