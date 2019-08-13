/**
 * @jsx createElement
 */
import React from 'react'
import createRegl from 'regl'
import { createStore, watch, remove, isBistate } from 'bistate'
import bunny from 'bunny'
import normals from 'angle-normals'
import { mat4 } from 'gl-matrix'

export const createElement = (type, props, ...children) => {
  return { type, props, children }
}

const isValidElement = obj => !!(obj && obj.type)

const ELEMENT = Symbol('element')
const COMPONENT = Symbol('component')
const FRAGMENT = Symbol('fragment')
const CONTEXT = Symbol('context')

const Fragment = FRAGMENT

export const create = factory => {
  if (typeof factory !== 'function') {
    throw new Error(`Expected factory to be a function, but got ${factory}`)
  }
  return {
    tag: ELEMENT,
    factory
  }
}

export const render = (element, root) => {
  let regl = createRegl(root)
  let params = { regl, root }
  let result = init(element)
  let cache = new Map()

  let tick = regl.frame(() => {
    // regl.clear({
    //   color: [0, 0, 0, 1]
    // })
    renderer(result.record, regl, cache)
  })

  return () => {
    tick.cancel()
    regl.destroy()
  }
}

const renderer = (record, regl, cache) => {
  for (let [factory, list] of record) {
    let draw = cache.get(factory) || factory(regl)

    cache.set(factory, draw)

    let propsList = list.map(layer => layer.elem.props)
    draw(propsList)
  }
}

const init = (node, params) => {
  if (node.type && (node.type.tag === ELEMENT || node.type === FRAGMENT)) {
    return initElement(node, params)
  } else if (typeof node.type === 'function') {
    return initComponent(node, params)
  }
  throw new Error(`Unknown type of node ${node}`)
}

const addRecord = (record, key, value) => {
  let list = record.get(key) || []

  if (Array.isArray(value)) {
    list.push(...value)
  } else {
    list.push(value)
  }

  record.set(key, list)
}

const initElement = (elem, params) => {
  let { factory } = elem.type
  let record = new Map()
  let children = []
  let layer = {
    type: ELEMENT,
    params,
    factory,
    elem,
    record,
    children
  }

  if (factory) {
    addRecord(record, factory, layer)
  }

  elem.children.flat(Infinity).map(child => {
    if (!isValidElement(child)) return

    let layer = init(child, params)

    for (let [key, value] of layer.record) {
      addRecord(record, key, value)
    }

    children.push(layer)
  })

  return layer
}

const initComponent = (elem, params) => {
  let result = elem.type({
    ...elem.props,
    children: elem.children
  })

  let record = new Map()

  let layer = {
    type: COMPONENT,
    params,
    elem,
    result,
    record
  }

  if (!Array.isArray(result)) {
    result = [result]
  }

  let contents = []

  result.forEach(item => {
    let layer = init(item, params)

    contents.push(layer)

    for (let [key, value] of layer.record) {
      addRecord(record, key, value)
    }
  })

  layer.contents = contents

  return layer
}

const View = create(regl => props => {
  if (Array.isArray(props)) {
    regl.clear(props[0])
  } else {
    regl.clear(props)
  }
})

const Triangle = create(regl =>
  regl({
    frag: `
      precision mediump float;
      uniform vec4 color;
      void main() {
        gl_FragColor = color;
      }`,

    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform float angle;
      uniform vec2 offset;
      void main() {
        gl_Position = vec4(
          cos(angle) * position.x + sin(angle) * position.y + offset.x,
          -sin(angle) * position.x + cos(angle) * position.y + offset.y, 0, 1);
      }`,

    attributes: {
      position: [0.5, 0, 0, 0.5, 1, 1]
    },

    uniforms: {
      // the batchId parameter gives the index of the command
      color: ({ tick }, props, batchId) => [
        Math.sin(0.02 * ((0.1 + Math.sin(batchId)) * tick + 3.0 * batchId)),
        Math.cos(0.02 * (0.02 * tick + 0.1 * batchId)),
        Math.sin(
          0.02 * ((0.3 + Math.cos(2.0 * batchId)) * tick + 0.8 * batchId)
        ),
        1
      ],
      angle: ({ tick }) => 0.01 * tick,
      offset: regl.prop('offset')
    },

    depth: {
      enable: false
    },

    count: 3
  })
)

const Bunny = create(regl =>
  regl({
    frag: `
    precision mediump float;
    varying vec3 vnormal;
    void main () {
      gl_FragColor = vec4(abs(vnormal), 1.0);
    }`,
    vert: `
    precision mediump float;
    uniform mat4 projection, view, model;
    attribute vec3 position, normal;
    varying vec3 vnormal;
    void main () {
      vnormal = normal;
      gl_Position = projection * view * model * vec4(position, 1.0);
    }`,
    attributes: {
      position: bunny.positions,
      normal: normals(bunny.cells, bunny.positions)
    },
    uniforms: {
      model: ({ tick }, props, batchId) => {
        let translate = mat4.translate(mat4.identity([]), mat4.identity([]), [
          props.offset[0] * 8,
          props.offset[1] * 8,
          0
        ])
        let scale = mat4.scale(mat4.identity([]), translate, [
          props.scale,
          props.scale,
          props.scale
        ])
        return scale
      },
      view: ({ tick }) => {
        const t = 0.01 * tick
        return mat4.lookAt(
          [],
          [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
          [0, 2.5, 0],
          [0, 1, 0]
        )
      },
      projection: ({ viewportWidth, viewportHeight }) =>
        mat4.perspective(
          [],
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          1000
        )
    },
    elements: bunny.cells
  })
)

const TriangleWithBunny = props => {
  return (
    <Triangle offset={props.offset}>
      <Bunny offset={props.offset} scale={0.5} />
    </Triangle>
  )
}

export default function test(canvas) {
  let propsList = [
    { offset: [-1, -1] },
    { offset: [-1, 0] },
    { offset: [-1, 1] },
    { offset: [0, -1] },
    { offset: [0, 0] },
    { offset: [0, 1] },
    { offset: [1, -1] },
    { offset: [1, 0] },
    { offset: [1, 1] }
  ]

  return render(
    <View color={[0, 0, 0, 1]}>
      {propsList.map((props, index) => {
        return <TriangleWithBunny {...props} key={index} />
      })}
    </View>,
    canvas
  )
}
