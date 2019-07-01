const fs = require('fs')
const { vec3 } = require('gl-matrix')

const pipe = (...args) => args.reduce((a, f) => f(a))
const from = (x, y, z) => vec3.fromValues(x, y, z)
const mul = (n, vec3a) => vec3.mul(vec3.create(), from(n, n, n), vec3a)
const add = (vec3a, vec3b) => vec3.add(vec3.create(), vec3a, vec3b)
const subtract = (vec3a, vec3b) => vec3.subtract(vec3.create(), vec3a, vec3b)
const addAll = (...args) => args.reduce(add)
const mulAll = (...args) => args.reduce(mul)
const dot = (vec3a, vec3b) => vec3.dot(vec3a, vec3b)

class Ray {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  origin() {
    return this.a
  }
  direction() {
    return this.b
  }
  pointAt(t) {
    let { a, b } = this
    return add(a, mul(t, b))
  }
}

// linear-blend/linear-interpolation
const lerp = (t, start, end) => add(mul(1.0 - t, start), mul(t, end))

const hitSphere = (center, radius, ray) => {
  let oc = subtract(ray.origin(), center)
  let a = dot(ray.direction(), ray.direction())
  let b = 2.0 * dot(oc, ray.direction())
  let c = dot(oc, oc) - radius * radius
  let discriminant = b * b - 4 * a * c

  if (discriminant < 0) return -1.0

  return (-b - Math.sqrt(discriminant)) / (2.0 * a)
}

const color = ray => {
  let center = from(0, 0, -1)
  let t = hitSphere(center, 0.5, ray)

  if (t > 0.0) {
    let n = vec3.normalize(vec3.create(), subtract(ray.pointAt(t), center))
    return mul(0.5, from(n[0] + 1.0, n[1] + 1.0, n[2] + 1.0))
  }

  let direction = vec3.normalize(vec3.create(), ray.direction())
  return lerp(
    0.5 * (direction[1] + 1.0),
    from(1.0, 1.0, 1.0),
    from(0.5, 0.7, 1.0)
  )
}

const test = () => {
  let content = []
  let nx = 200
  let ny = 100

  content.push('P3')
  content.push(`${nx} ${ny}`)
  content.push('255')

  let lowerLeftCorner = from(-2.0, -1.0, -1.0)
  let horizontal = from(4.0, 0.0, 0.0)
  let vertical = from(0.0, 2.0, 0.0)
  let origin = from(0.0, 0.0, 0.0)

  for (let j = ny - 1; j >= 0; j--) {
    for (i = 0; i < nx; i++) {
      let u = i / nx
      let v = j / ny
      let direction = addAll(
        lowerLeftCorner,
        mul(u, horizontal),
        mul(v, vertical)
      )
      let ray = new Ray(origin, direction)
      let col = color(ray)
      let r = Math.floor(255.99 * col[0])
      let g = Math.floor(255.99 * col[1])
      let b = Math.floor(255.99 * col[2])
      content.push([r, g, b].join(' '))
    }
  }

  fs.writeFileSync('test.ppm', content.join('\n'))
}

test()
