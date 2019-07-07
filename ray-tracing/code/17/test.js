const { vec3 } = require('gl-matrix')
const { _add_, _sub_, _mul_, _div_, _negate_ } = require('../lib/runtime')

const from = (x, y, z) => vec3.fromValues(x, y, z)
const dot = (vec3a, vec3b) => vec3.dot(vec3a, vec3b)
const cross = (vec3a, vec3b) => vec3.cross(vec3.create(), vec3a, vec3b)
const normalize = vec3a => vec3.normalize(vec3.create(), vec3a)

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

const randomInUnitDisk = () => {
  let p

  do {
    let randomVec3 = from(Math.random(), Math.random(), 0.0)
    p = 2.0 * randomVec3 - from(1.0, 1.0, 0.0)
  } while (dot(p, p) >= 1.0)

  return p
}

class Camera {
  constructor(lookFrom, lookAt, vup, vfov, aspect, aperture, focusDist) {
    let theta = (vfov * Math.PI) / 180
    let halfHeight = Math.tan(theta / 2)
    let halfWidth = halfHeight * aspect
    let origin = lookFrom
    let w = normalize(lookFrom - lookAt)
    let u = normalize(cross(vup, w))
    let v = cross(w, u)
    let lowerLeftCorner =
      origin - focusDist * (u * halfWidth + v * halfHeight + w)
    let horizontal = focusDist * 2 * u * halfWidth
    let vertical = focusDist * 2 * v * halfHeight

    this.u = u
    this.v = v
    this.origin = origin
    this.lowerLeftCorner = lowerLeftCorner
    this.horizontal = horizontal
    this.vertical = vertical
    this.lensRadius = aperture / 2
  }
  getRay(s, t) {
    let { origin, lowerLeftCorner, horizontal, vertical } = this
    let rd = this.lensRadius * randomInUnitDisk()
    let offset = this.u * rd[0] + this.v * rd[1]
    let direction = lowerLeftCorner + s * horizontal + t * vertical - origin
    let ray = new Ray(origin + offset, direction - offset)
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

const schlick = (consine, refractIndex) => {
  let r0 = (1 - refractIndex) / (1 + refractIndex)
  r0 = r0 * r0
  return r0 + (1 - r0) * Math.pow(1 - consine, 5)
}

class DielectricMaterial {
  constructor(refractIndex) {
    this.refractIndex = refractIndex
  }
  scatter(ray, record, ref) {
    let outwardNormal = vec3.create()
    let reflected = reflect(ray.direction(), record.normal)
    let ni_over_nt = 0.0
    let consine = 0.0

    ref.attenuation = from(1.0, 1.0, 1.0)

    let dotResult = dot(ray.direction(), record.normal)

    if (dotResult > 0) {
      outwardNormal = -record.normal
      ni_over_nt = this.refractIndex
      consine = (this.refractIndex * dotResult) / vec3.length(ray.direction())
    } else {
      outwardNormal = record.normal
      ni_over_nt = 1.0 / this.refractIndex
      consine = -dotResult / vec3.length(ray.direction())
    }

    let refractProb = 0.0

    if (refract(ray.direction(), outwardNormal, ni_over_nt, ref)) {
      refractProb = schlick(consine, this.refractIndex)
    } else {
      refractProb = 1.0
    }

    if (Math.random() < refractProb) {
      ref.scattered = new Ray(record.p, reflected)
    } else {
      ref.scattered = new Ray(record.p, ref.refracted)
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

const randomScene = amount => {
  let list = []
  let range = Math.floor(Math.sqrt(amount) / 2)
  let start = -range
  let end = +range

  list[0] = new Sphere(
    from(0.0, -1000, 0),
    1000,
    new LambertianMaterial(from(0.5, 0.5, 0.5))
  )

  let i = 1
  let based = from(4.0, 0.2, 0.0)

  for (let a = start; a < end; a++) {
    for (let b = start; b < end; b++) {
      let chooseMat = Math.random()
      let center = from(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random())
      if (vec3.length(center - based) > 0.9) {
        if (chooseMat < 0.8) {
          let material = new LambertianMaterial(
            from(
              Math.random() * Math.random(),
              Math.random() * Math.random(),
              Math.random() * Math.random()
            )
          )
          list[i++] = new Sphere(center, 0.2, material)
        } else if (chooseMat < 0.95) {
          let material = new MetalMaterial(
            from(
              0.5 * (1 + Math.random()),
              0.5 * (1 + Math.random()),
              0.5 * (1 + Math.random())
            ),
            0.5 * Math.random()
          )
          list[i++] = new Sphere(center, 0.2, material)
        } else {
          list[i++] = new Sphere(center, 0.2, new DielectricMaterial(1.5))
        }
      }
    }
  }

  list[i++] = new Sphere(from(0.0, 1.0, 0.0), 1.0, new DielectricMaterial(1.5))
  list[i++] = new Sphere(
    from(-4.0, 1.0, 0.0),
    1.0,
    new LambertianMaterial(from(0.4, 0.2, 0.1))
  )
  list[i++] = new Sphere(
    from(4.0, 1.0, 0.0),
    1.0,
    new MetalMaterial(from(0.7, 0.6, 0.5), 0.0)
  )

  return new HitableList(list)
}

export default ({
  width = 800,
  height = 400,
  amount = 2,
  lookFrom = from(13.0, 2.0, 3.0),
  lookAt = from(0.0, 0.0, 0.0),
  vup = from(0.0, 1.0, 0.0),
  vfov = 20,
  aspect = width / height,
  focusDist = 10,
  aperture = 0.1
}) => {
  let nx = width
  let ny = height
  let camera = new Camera(
    lookFrom,
    lookAt,
    vup,
    vfov,
    aspect,
    aperture,
    focusDist
  )
  let world = randomScene(amount)

  let renderByPosition = (x, y) => {
    let u = (x + Math.random()) / nx
    let v = (y + Math.random()) / ny
    let ray = camera.getRay(u, v)

    return color(ray, world)
  }

  let render = function*() {
    for (let j = ny - 1; j >= 0; j--) {
      for (let i = 0; i < nx; i++) {
        let [r, g, b] = renderByPosition(i, j)
        let a = 1

        yield r
        yield g
        yield b
        yield a
      }
    }
  }

  return { render, renderByPosition }
}
