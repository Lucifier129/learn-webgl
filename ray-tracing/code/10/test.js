const fs = require('fs')
const { vec3 } = require('gl-matrix')
const { _add_, _sub_, _mul_, _div_, _negate_ } = require('../lib/runtime')

const from = (x, y, z) => vec3.fromValues(x, y, z)
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
    return a + t * b
  }
}

// linear-blend/linear-interpolation
const lerp = (t, start, end) => (1.0 - t) * start + t * end

const createRecord = () => {
  return {
    t: 0,
    p: vec3.create(),
    normal: vec3.create()
  }
}

class Sphere {
  constructor(center, radius, material) {
    this.center = center
    this.radius = radius
    this.material = material
  }
  hit(ray, tmin, tmax, record) {
    let oc = ray.origin() - this.center
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
      record.normal = (record.p - this.center) / this.radius
      record.material = this.material
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
    let direction = lowerLeftCorner + u * horizontal + v * vertical
    let ray = new Ray(origin, direction)
    return ray
  }
}

const randomInUnitSphere = () => {
  let p

  do {
    let randomVec3 = from(Math.random(), Math.random(), Math.random())
    p = 2.0 * randomVec3 - from(1.0, 1.0, 1.0)
  } while (vec3.squaredLength(p) >= 1.0)

  return p
}

class LambertianMaterial {
  constructor(albedo) {
    this.albedo = albedo
  }
  scatter(ray, record, ref) {
    let target = record.p + record.normal + randomInUnitSphere()
    let direction = target - record.p
    ref.scattered = new Ray(record.p, direction)
    ref.attenuation = this.albedo
    return true
  }
}

const reflect = (v, n) => {
  return v - 2.0 * dot(v, n) * n
}

class MetalMaterial {
  constructor(albedo, fuzz = 1) {
    this.albedo = albedo
    this.fuzz = Math.min(fuzz, 1)
  }
  scatter(ray, record, ref) {
    let reflected = reflect(
      vec3.normalize(vec3.create(), ray.direction()),
      record.normal
    )
    ref.scattered = new Ray(
      record.p,
      reflected + this.fuzz * randomInUnitSphere()
    )
    ref.attenuation = this.albedo
    return dot(ref.scattered.direction(), record.normal) > 0
  }
}

const refract = (v, normal, ni_over_nt, ref) => {
  let uv = vec3.normalize(vec3.create(), v)
  let dt = dot(uv, normal)
  let discriminant = 1.0 - ni_over_nt * ni_over_nt * (1.0 - dt * dt)

  if (discriminant > 0) {
    ref.refracted =
      ni_over_nt * (uv - normal * dt) - normal * Math.sqrt(discriminant)
    return true
  }

  return false
}

class DielectricMaterial {
  constructor(refractIndex) {
    this.refractIndex = refractIndex
  }
  scatter(ray, record, ref) {
    let outwardNormal = vec3.create()
    let reflected = reflect(ray.direction(), record.normal)
    let ni_over_nt = 0.0

    ref.attenuation = from(1.0, 1.0, 1.0)

    if (dot(ray.direction(), record.normal) > 0) {
      outwardNormal = -record.normal
      ni_over_nt = this.refractIndex
    } else {
      outwardNormal = record.normal
      ni_over_nt = 1.0 / this.refractIndex
    }

    if (refract(ray.direction(), outwardNormal, ni_over_nt, ref)) {
      ref.scattered = new Ray(record.p, ref.refracted)
    } else {
      ref.scattered = new Ray(record.p, reflected)
      return false
    }

    return true
  }
}

const color = (ray, world, depth = 0) => {
  let record = createRecord()

  if (world.hit(ray, 0.001, Infinity, record)) {
    let ref = {
      scattered: null,
      attenuation: 0
    }

    if (depth >= 50 || !record.material.scatter(ray, record, ref)) {
      return from(0.0, 0.0, 0.0)
    }

    return ref.attenuation * color(ref.scattered, world, depth + 1)
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

  world.push(
    new Sphere(
      from(0.0, 0.0, -1.0),
      0.5,
      new LambertianMaterial(from(0.1, 0.2, 0.5))
    )
  )
  world.push(
    new Sphere(
      from(0.0, -100.5, -1.0),
      100,
      new LambertianMaterial(from(0.8, 0.8, 0.0))
    )
  )

  world.push(
    new Sphere(
      from(1.0, 0.0, -1.0),
      0.5,
      new MetalMaterial(from(0.8, 0.6, 0.2), 0.0)
    )
  )

  world.push(
    new Sphere(from(-1.0, 0.0, -1.0), 0.5, new DielectricMaterial(1.5))
  )

  for (let j = ny - 1; j >= 0; j--) {
    for (i = 0; i < nx; i++) {
      let col = from(0.0, 0.0, 0.0)

      for (let k = 0; k < ns; k++) {
        let u = (i + Math.random()) / nx
        let v = (j + Math.random()) / ny
        let ray = camera.getRay(u, v)
        col = col + color(ray, world)
      }

      col = col / ns
      col = from(Math.sqrt(col[0]), Math.sqrt(col[1]), Math.sqrt(col[2]))

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
