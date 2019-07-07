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

    let params = {
      fovy: 30,
      near: 1,
      far: 100,
      eyeX: 3,
      eyeY: 3,
      eyeZ: 7,
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      upX: 0,
      upY: 1,
      upZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1
    }
    let gui = new dat.GUI({ name: 'cube' })

    gui.add(params, 'fovy', 0, 90)
    gui.add(params, 'near', 1, 1000)
    gui.add(params, 'far', 0, 1000)
    gui.add(params, 'eyeX', -10, 100)
    gui.add(params, 'eyeY', -10, 100)
    gui.add(params, 'eyeZ', -10, 100)
    gui.add(params, 'centerX', -1, 1)
    gui.add(params, 'centerY', -1, 1)
    gui.add(params, 'centerZ', -1, 1)
    gui.add(params, 'upX', -10, 10)
    gui.add(params, 'upY', -10, 10)
    gui.add(params, 'upZ', -10, 10)
    gui.add(params, 'scaleX', 0, 10).step(0.1)
    gui.add(params, 'scaleY', 0, 10).step(0.1)
    gui.add(params, 'scaleZ', 0, 10).step(0.1)

    let clear = null
    let over = false

    renderCube(gl, params).then($clear => {
      clear = $clear
      if (over) clear()
    })

    return () => {
      over = true
      if (clear) clear()
      gui.destroy()
    }
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

const renderCube = async (gl, params) => {
  let cube = await makeCube(gl)

  return raf(() => {
    let projection = mat4.create()
    let modelview = mat4.create()
    let mvp = mat4.create()

    mat4.perspective(
      projection,
      (params.fovy * Math.PI) / 180,
      1,
      params.near,
      params.far
    )

    mat4.lookAt(
      modelview,
      [params.eyeX, params.eyeY, params.eyeZ],
      [params.centerX, params.centerY, params.centerZ],
      [params.upX, params.upY, params.upZ]
    )

    mat4.scale(modelview, modelview, [
      params.scaleX,
      params.scaleY,
      params.scaleZ
    ])

    mat4.multiply(mvp, projection, modelview)

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    cube.render(mvp)
  })
}

const makeCube = async gl => {
  let VSHADER_SOURCE = glsl`
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uMvpMatrix;
    varying vec4 vColor;
    void main() {
      gl_Position = uMvpMatrix * aPosition;
      vColor = aColor;
    }
  `

  let FSHADER_SOURCE = glsl`
    precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `

  let program = makeProgram(gl, {
    vertex: VSHADER_SOURCE,
    fragment: FSHADER_SOURCE
  })

  let color = (r, g, b) => [r, g, b].map(n => n / 255)

  let colors = [
    color(161, 98, 247),
    color(111, 136, 254),
    color(69, 227, 255),
    color(92, 127, 167),
    color(82, 140, 162),
    color(165, 222, 141),
    color(240, 74, 76),
    color(62, 97, 155),
    color(15, 107, 172),
    color(37, 139, 214),
    color(133, 183, 254),
    color(198, 206, 255)
  ]

  let vertexList = createVertexList([
    // front
    [-0.5, 0.5, -0.5, colors[0]],
    [-0.5, -0.5, -0.5, colors[0]],
    [0.5, 0.5, -0.5, colors[0]],
    [0.5, -0.5, -0.5, colors[0]],
    // back
    [-0.5, 0.5, 0.5, colors[0]],
    [-0.5, -0.5, 0.5, colors[0]],
    [0.5, 0.5, 0.5, colors[0]],
    [0.5, -0.5, 0.5, colors[0]],
    // top
    [-0.5, 0.5, -0.5, colors[2]],
    [-0.5, 0.5, 0.5, colors[2]],
    [0.5, 0.5, -0.5, colors[2]],
    [0.5, 0.5, 0.5, colors[2]],
    // bottom
    [-0.5, -0.5, -0.5, colors[3]],
    [-0.5, -0.5, 0.5, colors[3]],
    [0.5, -0.5, -0.5, colors[3]],
    [0.5, -0.5, 0.5, colors[3]],
    // left
    [-0.5, 0.5, -0.5, colors[4]],
    [-0.5, -0.5, -0.5, colors[4]],
    [-0.5, 0.5, 0.5, colors[4]],
    [-0.5, -0.5, 0.5, colors[4]],
    // right
    [0.5, 0.5, -0.5, colors[5]],
    [0.5, 0.5, 0.5, colors[5]],
    [0.5, -0.5, -0.5, colors[5]],
    [0.5, -0.5, 0.5, colors[5]]
  ])

  let uniform = getUniform(gl, program)
  let attribute = getAttribute(gl, program)

  let FSIZE = vertexList.BYTES_PER_ELEMENT

  let vertexVBO = makeVBO(gl, {
    type: gl.ARRAY_BUFFER,
    data: vertexList
  })

  enableAttributes(gl, gl.ARRAY_BUFFER, vertexVBO, [
    {
      location: attribute.aPosition,
      size: 3,
      stride: FSIZE * 6,
      offset: 0
    },
    {
      location: attribute.aColor,
      size: 3,
      stride: FSIZE * 6,
      offset: FSIZE * 3
    }
  ])

  let indexList = new Uint8Array(
    [
      [0, 1, 2],
      [1, 2, 3],
      [4, 5, 6],
      [5, 6, 7],
      [8, 9, 10],
      [9, 10, 11],
      [12, 13, 14],
      [13, 14, 15],
      [16, 17, 18],
      [17, 18, 19],
      [20, 21, 22],
      [22, 21, 23]
    ].flat(Infinity)
  )

  let indexVBO = makeVBO(gl, {
    type: gl.ELEMENT_ARRAY_BUFFER,
    data: indexList
  })

  let render = mvpMatrix => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexVBO)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexVBO)
    gl.useProgram(program)
    gl.uniformMatrix4fv(uniform.uMvpMatrix, false, mvpMatrix)
    gl.drawElements(gl.TRIANGLES, indexList.length, gl.UNSIGNED_BYTE, 0)
  }

  return { render }
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
