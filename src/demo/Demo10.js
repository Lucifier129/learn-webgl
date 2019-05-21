import React, { useEffect, useRef } from 'react'
import { mat4, vec3 } from 'gl-matrix'
import { loadImageList, glsl, createVertexList } from './util'
import skyImageSrc from './image/sky.jpg'
import circleImageSrc from './image/circle.gif'

export default function Demo02() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    let gl = canvas.getContext('webgl')
    let angle = 0
    makeItem(gl).then(async item => {
      let render = async () => {
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
        requestAnimationFrame(render)
      }

      render()
    })
  }, [])

  return <canvas width={400} height={400} ref={ref} />
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

  let location = makeLocation(gl, {
    program,
    attribute: ['aPosition', 'aTexCoor'],
    uniform: ['uSampler0', 'uSampler1', 'uRotateM']
  })

  let vertexList = createVertexList([
    [[-0.5, 0.5], [0.0, 1.0]],
    [[-0.5, -0.5], [0.0, 0.0]],
    [[0.5, 0.5], [1.0, 1.0]],
    [[0.5, -0.5], [1.0, 0.0]]
  ])

  let FSIZE = vertexList.BYTES_PER_ELEMENT

  let buffer = attachBuffer(gl, {
    type: gl.ARRAY_BUFFER,
    data: vertexList
  })

  enableAttribute(gl, {
    location: location.aPosition,
    size: 2,
    stride: FSIZE * 4,
    offset: 0
  })

  enableAttribute(gl, {
    location: location.aTexCoor,
    size: 2,
    stride: FSIZE * 4,
    offset: FSIZE * 2
  })

  let imageSrcList = [skyImageSrc, circleImageSrc]
  let [skyImage, circleImage] = await loadImageList(imageSrcList)

  attachTexture2D(gl, {
    unit: 0,
    location: location.uSampler0,
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
    location: location.uSampler1,
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

  let use = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.useProgram(program)
  }

  let draw = () => {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let identityM = mat4.create()
  let rotateM = mat4.create()
  let rotate = async (radian, axis) => {
    mat4.rotate(rotateM, identityM, radian, axis)
    gl.uniformMatrix4fv(location.uRotateM, false, rotateM)
  }

  let render = props => {
    use()
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

const attachBuffer = (gl, { type, data, usage = gl.STATIC_DRAW }) => {
  let buffer = gl.createBuffer()
  gl.bindBuffer(type, buffer)
  gl.bufferData(type, data, usage)
  return buffer
}

const enableAttribute = (
  gl,
  { location, size, type = gl.FLOAT, normalized = false, stride, offset }
) => {
  gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
  gl.enableVertexAttribArray(location)
}

const mapKeyListToObj = (list, f) => {
  return list.reduce((obj, name, index) => {
    obj[name] = f(name, index)
    return obj
  }, {})
}

const makeAttributeLocation = (gl, program, nameList = []) => {
  return mapKeyListToObj(nameList, name => gl.getAttribLocation(program, name))
}

const makeUniformLocation = (gl, program, nameList = []) => {
  return mapKeyListToObj(nameList, name => gl.getUniformLocation(program, name))
}

const makeLocation = (gl, { program, attribute, uniform }) => {
  return {
    ...makeAttributeLocation(gl, program, attribute),
    ...makeUniformLocation(gl, program, uniform)
  }
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

  console.log(location, unit, image, flipY, parameters)

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
