const fs = require('fs')
const { vec3 } = require('gl-matrix')

const pipe = (...args) => args.reduce((a, f) => f(a))
const from = (x, y, z) => vec3.fromValues(x, y, z)
const mul = (n, vec3a) => vec3.mul(vec3.create(), from(n, n, n), vec3a)
const add = (vec3a, vec3b) => vec3.add(vec3.create(), vec3a, vec3b)
const subtract = (vec3a, vec3b) => vec3.subtract(vec3.create(), vec3a, vec3b)
const addAll = (...args) => args.reduceRight(add)
const mulAll = (...args) => args.reduce(mul)
const dot = (vec3a, vec3b) => vec3.dot(vec3a, vec3b)
const divide = (vec3a, n) => vec3.divide(vec3.create(), vec3a, from(n, n, n))

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

const createRecord = () => {
  return {
    t: 0,
    p: vec3.create(),
    normal: vec3.create()
  }
}

class Sphere {
  constructor(center, radius) {
    this.center = center
    this.radius = radius
  }
  hit(ray, tmin, tmax, record) {
    let oc = subtract(ray.origin(), this.center)
    let a = dot(ray.direction(), ray.direction())
    let b = dot(oc, ray.direction())
    let c = dot(oc, oc) - this.radius * this.radius
    let discriminant = b * b - a * c

    if (discriminant < 0) return false

    let temp = (-b - Math.sqrt(discriminant)) / a
    let isValid = temp < tmax && temp > tmin

    if (!isValid) {
      temp = (-b + Math.sqrt(discriminant)) / a
      isValid = temp < tmax && temp > tmin
    }

    if (isValid) {
      record.t = temp
      record.p = ray.pointAt(temp)
      record.normal = divide(subtract(record.p, this.center), this.radius)
      return true
    }

    return false
  }
}

class HitableList {
  constructor(list) {
    this.list = list
  }
  hit(ray, tmin, tmax, record) {
    let tempRecord = createRecord()
    let hited = false
    let closest = tmax

    for (let object of this.list) {
      if (object.hit(ray, tmin, closest, tempRecord)) {
        hited = true
        closest = tempRecord.t
        Object.assign(record, tempRecord)
      }
    }

    return hited
  }
  push(...args) {
    this.list.push(...args)
  }
}

class Camera {
  constructor(origin, lowerLeftCorner, horizontal, vertical) {
    this.origin = origin
    this.lowerLeftCorner = lowerLeftCorner
    this.horizontal = horizontal
    this.vertical = vertical
  }
  getRay(u, v) {
    let { origin, lowerLeftCorner, horizontal, vertical } = this
    let direction = addAll(
      lowerLeftCorner,
      mul(u, horizontal),
      mul(v, vertical)
    )
    let ray = new Ray(origin, direction)
    return ray
  }
}

const randomInUnitSphere = () => {
  let p

  do {
    p = subtract(
      mul(2.0, from(Math.random(), Math.random(), Math.random())),
      from(1.0, 1.0, 1.0)
    )
  } while (vec3.squaredLength(p) >= 1.0)

  return p
}

const color = (ray, world) => {
  let record = createRecord()

  // tmin 为 0.001 可以忽略光源到撞击点太近的反射光线
  if (world.hit(ray, 0.001, Infinity, record)) {
    // /**
    //  * 在反射场景中，反射点作为光源对外发射光线
    //  * 如果该光线照射到的目标点，跟光源点足够接近
    //  * 光线将在不断的反射过程中，消耗完能量，呈现黑色
    //  */
    // if (vec3.equals(record.p, ray.origin())) {
    //   return from(0.0, 0.0, 0.0)
    // }

    let target = addAll(record.p, record.normal, randomInUnitSphere())
    let diffuseDirection = subtract(target, record.p)
    let diffuseRay = new Ray(record.p, diffuseDirection)
    return mul(0.5, color(diffuseRay, world))
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
  let ns = 100

  content.push('P3')
  content.push(`${nx} ${ny}`)
  content.push('255')

  let lowerLeftCorner = from(-2.0, -1.0, -1.0)
  let horizontal = from(4.0, 0.0, 0.0)
  let vertical = from(0.0, 2.0, 0.0)
  let origin = from(0.0, 0.0, 0.0)
  let camera = new Camera(origin, lowerLeftCorner, horizontal, vertical)
  let world = new HitableList([])

  world.push(new Sphere(from(0.0, 0.0, -1.0), 0.5))
  world.push(new Sphere(from(0.0, -100.5, -1.0), 100))

  for (let j = ny - 1; j >= 0; j--) {
    for (i = 0; i < nx; i++) {
      let col = from(0.0, 0.0, 0.0)

      for (let k = 0; k < ns; k++) {
        let u = (i + Math.random()) / nx
        let v = (j + Math.random()) / ny
        let ray = camera.getRay(u, v)
        col = vec3.add(col, col, color(ray, world))
      }

      col = divide(col, ns)

      // let u = i / nx
      // let v = j / ny
      // let ray = camera.getRay(u, v)
      // let col = color(ray, world)

      let r = Math.floor(255.99 * col[0])
      let g = Math.floor(255.99 * col[1])
      let b = Math.floor(255.99 * col[2])
      content.push([r, g, b].join(' '))
    }
  }

  fs.writeFileSync('test.ppm', content.join('\n'))
}

console.time('render')
test()
console.timeEnd('render')
