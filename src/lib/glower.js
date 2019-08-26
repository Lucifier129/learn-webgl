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
const CONTEXT = Symbol('context')
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

export const render = (elem, root) => {
  if (!isValidElement(elem)) {
    throw new Error(`Unexpected elem received ${elem}`)
  }

  if (!root) {
    throw new Error(`Unexpected root received ${root}`)
  }

  let previous = root[INTERNAL]

  if (!previous) {
    let layer = init(elem, root)
    let { regl, result, cache } = layer

    root[INTERNAL] = layer

    let tick = regl.frame(() => {
      renderer(result.record, regl, cache)
    })

    return () => {
      tick.cancel()
      regl.destroy()
    }
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

const init = (elem, root) => {
  let layer = {
    [LAYER]: ROOT,
    elem,
    cache: new Map(),
    regl: createRegl(root),
    result: null
  }
  let params = {}
  let result = initNode(elem, layer, params)

  layer.result = result

  return layer
}

// const update = (elem, oldLayer) => {
//   let layer = {
//     [LAYER]: ROOT,
//     elem,
//     cache: oldLayer.cache,
//     regl: oldLayer.regl,
//     result: null
//   }

//   let params = {}

//   let result = updateNode(elem, oldLayer, layer, params)

//   layer.result = result

//   return layer
// }

// const updateNode = (newNode, oldLayer, parent, params) => {
//   let oldNode = oldLayer.elem

//   if (newNode === oldNode) {
//     return oldLayer
//   }

//   if (newNode.type !== oldNode.type) {
//     return initNode(newNode, parent, params)
//   }

//   if (newNode.type === FRAGMENT) {
//     return updateFragment(newNode, oldLayer, parent, params)
//   }

//   if (newNode.type[ELEMENT]) {
//     return updateElement(newNode, oldLayer, parent, params)
//   }

//   if (typeof node.type === 'function') {
//     return updateComponent(node, oldLayer, parent, params)
//   }

//   throw new Error(`Unknown type of node ${node}`)
// }

// const createUpdateElement = typeName => (elem, oldLayer, parent, params) => {
//   let layer = {
//     [LAYER]: typeName,
//     parent,
//     elem,
//     record: new Map(),
//     factory: elem.type,
//     children: []
//   }

//   let { factory, children, record } = layer

//   if (typeof factory === 'function') {
//     addRecord(record, factory, elem.props)
//   }

//   let oldChildren = oldLayer.elem.children

//   for (let i = 0; i < elem.children.length; i++) {
//     let child = elem.children[i]
//     let childLayer = null

//     // reuse the old layer if possible
//     for (let j = 0; j < oldChildren.length; i++) {
//       let oldChild = oldChildren[j]
//       if (oldChild === child) {
//         childLayer = oldLayer.children[j]
//         break
//       }
//     }

//     if (childLayer) {
//       childLayer.parent = layer
//     } else {
//       childLayer = initNode(child, layer, params)
//     }

//     for (let [factory, props] of childLayer.record) {
//       addRecord(record, factory, props)
//     }

//     children.push(layer)
//   }

//   return layer
// }

const initNode = (node, parent, params) => {
  if (!node || !node.type) {
    throw new Error(`Unexpeted node ${node}`)
  }

  if (node.type === FRAGMENT) {
    return initFragment(node, parent, params)
  }

  if (node.type[ELEMENT]) {
    return initElement(node, parent, params)
  }

  if (typeof node.type === 'function') {
    return initComponent(node, parent, params)
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

const initChildren = (children, parentLayer, params) => {
  let results = []

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    let childLayer = initNode(child, parentLayer, params)

    for (let [factory, props] of childLayer.record) {
      addRecord(parentLayer.record, factory, props)
    }

    results.push(childLayer)
  }

  return results
}

const updateChildren = (children, parentLayer, oldParentLayer, params) => {
  let oldChildren = oldParentLayer.elem.children
  let statusList = Array(oldChildren.length)

  // check equal
  for (let i = 0; i < oldChildren.length; i++) {
    let oldChild = oldChildren[i]

    for (let j = 0; j < children.length; i++) {
      if (statusList[j]) {
        continue
      }

      let child = children[j]
      if (child === oldChild) {
        statusList[j] = 'equal'
        break
      }
    }
  }

  let removes = []

  // check update
  for (let i = 0; i < oldChildren.length; i++) {
    let oldChild = oldChildren[i]
    let isReused = false

    for (let j = 0; j < children.length; i++) {
      if (statusList[j]) {
        continue
      }

      let child = children[j]
      if (
        child.type === oldChild.type &&
        child.props.key === oldChild.props.key
      ) {
        statusList[j] = 'update'
        isReused = true
        break
      }
    }

    if (!isReused) {
      removes.push(i)
    }
  }

  let results = []

  for (let i = 0; i < children.length; i++) {
    let status = statusList[i]
    let child = children[i]

    if (status) {
      let layer = oldParentLayer.children[i]

      results[i] = layer

      layer.status = status

      if (status === 'update') {
        layer.elem = child
      }
    } else {
      results[i] = initNode(child, parentLayer, params)
    }
  }

  // parentLayer.effects

  return results
}

const createInitElement = typeName => (elem, parent, params) => {
  let layer = {
    [LAYER]: typeName,
    parent,
    elem,
    record: new Map(),
    factory: elem.type,
    children: null
  }

  let { factory, children, record } = layer

  if (typeof factory === 'function') {
    addRecord(record, factory, elem.props)
  }

  layer.children = initChildren(elem.children, layer, params)

  return layer
}

const initElement = createInitElement(ELEMENT)
const initFragment = createInitElement(FRAGMENT)
const initContext = createInitElement(CONTEXT)

const initComponent = (elem, parent, params) => {
  let layer = {
    [LAYER]: COMPONENT,
    parent,
    elem,
    record: new Map(),
    contents: null,
    result: null
  }

  let result = elem.type({
    ...elem.props,
    children: elem.children
  })

  if (!Array.isArray(result)) {
    result = [result]
  }

  layer.result = result
  layer.contents = initChildren(result, layer, params)

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
