/**
 * @jsx createElement
 */
import React from 'react'
import createRegl from 'regl'
import bunny from 'bunny'
import normals from 'angle-normals'
import { mat4 } from 'gl-matrix'

const ELEMENT = Symbol('element')
const COMPONENT = Symbol('component')
const FRAGMENT = Symbol('fragment')
const LAYER = Symbol('layer')
const ROOT = Symbol('root')
const INTERNAL = Symbol('internal')

const isLayer = input => !!(input && input[LAYER])

export const isValidElement = input => !!(input && input.type)

export const createElement = (type, props, ...children) => {
  return {
    type,
    props,
    children: flatChildren(children)
  }
}

const flatChildren = (children, results = []) => {
  for (let i = 0; i < children.length; i++) {
    let child = children[i]

    if (isValidElement(child)) {
      results.push(child)
    } else if (Array.isArray(child)) {
      flatChildren(child, results)
    }
  }
  return results
}

export const create = factory => {
  if (typeof factory !== 'function') {
    throw new Error(`Expected factory to be a function, but got ${factory}`)
  }
  factory[ELEMENT] = true
  return factory
}

export const render = (vnode, root) => {
  if (!isValidElement(vnode)) {
    throw new Error(`Unexpected elem received ${vnode}`)
  }

  if (!root) {
    throw new Error(`Unexpected root received ${root}`)
  }

  let previous = root[INTERNAL]

  if (!previous) {
    let tick = null
    let cache = new Map()
    let record = new Map()

    let handler = {
      addRecord: (key, value) => {
        addRecord(record, key, value)
      }
    }

    let layer = init(vnode, handler)
    let regl = createRegl(root)

    root[INTERNAL] = { layer, root, regl }

    let start = () => {
      if (tick) tick.cancel()
      tick = regl.frame(() => {
        renderer(record, regl, cache)
      })
    }

    start()
    return
  }

  throw new Error('todo: supports update phase')
}

const renderer = (record, regl, cache) => {
  for (let [factory, propsList] of record) {
    let draw = cache.get(factory) || factory(regl)
    cache.set(factory, draw)
    draw(propsList)
  }
}

const init = (vnode, handler) => {
  let layer = {
    [LAYER]: ROOT,
    handler,
    body: null
  }

  handler.root = layer
  layer.body = initNode(vnode, layer, handler)

  return layer
}

const initNode = (node, parent, handler) => {
  if (!node || !node.type) {
    throw new Error(`Unexpeted node ${node}`)
  }

  if (node.type === FRAGMENT) {
    return initFragment(node, parent, handler)
  }

  if (node.type[ELEMENT]) {
    return initElement(node, parent, handler)
  }

  if (typeof node.type === 'function') {
    return initComponent(node, parent, handler)
  }

  throw new Error(`Unknown type of node ${node}`)
}

const addRecord = (record, key, value) => {
  let list = record.get(key) || []

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      list[list.length] = value[i]
    }
  } else {
    list[list.length] = value
  }

  record.set(key, list)
}

const initChildren = (children, parent, handler) => {
  let results = []
  let prev = null

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    let childLayer = initNode(child, parent, handler)

    if (prev) {
      prev.next = childLayer
    }

    childLayer.prev = prev

    prev = childLayer

    results.push(childLayer)
  }

  return results
}

const createInitElement = typeName => (vnode, parent, handler) => {
  let layer = {
    [LAYER]: typeName,
    root: handler.root,
    parent,
    vnode,
    children: null,
    next: null,
    prev: null
  }

  if (typeName === ELEMENT) {
    handler.addRecord(vnode.type, vnode.props)
  }

  layer.children = initChildren(vnode.children, layer, handler)

  return layer
}

const initElement = createInitElement(ELEMENT)
const initFragment = createInitElement(FRAGMENT)

const initComponent = (vnode, parent, handler) => {
  let layer = {
    [LAYER]: COMPONENT,
    root: handler.root,
    vnode,
    parent,
    next: null,
    prev: null,
    contents: null,
    result: null
  }

  let result = vnode.type({
    ...vnode.props,
    children: vnode.children
  })

  if (!Array.isArray(result)) {
    result = [result]
  } else {
    result = flatChildren(result)
  }

  layer.result = result
  layer.contents = initChildren(result, parent, handler)

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
