const fs = require('fs');

const {
  vec3
} = require('gl-matrix');

const {
  _add_,
  _sub_,
  _mul_,
  _div_,
  _negate_
} = require('../lib/runtime');

const from = (x, y, z) => vec3.fromValues(x, y, z);

const dot = (vec3a, vec3b) => vec3.dot(vec3a, vec3b);

const cross = (vec3a, vec3b) => vec3.cross(vec3.create(), vec3a, vec3b);

const normalize = vec3a => vec3.normalize(vec3.create(), vec3a);

class Ray {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  origin() {
    return this.a;
  }

  direction() {
    return this.b;
  }

  pointAt(t) {
    let {
      a,
      b
    } = this;
    return _add_(a, _mul_(t, b));
  }

} // linear-blend/linear-interpolation


const lerp = (t, start, end) => _add_(_mul_(_sub_(1.0, t), start), _mul_(t, end));

const createRecord = () => {
  return {
    t: 0,
    p: vec3.create(),
    normal: vec3.create()
  };
};

class Sphere {
  constructor(center, radius, material) {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(ray, tmin, tmax, record) {
    let oc = _sub_(ray.origin(), this.center);

    let a = dot(ray.direction(), ray.direction());
    let b = dot(oc, ray.direction());

    let c = _sub_(dot(oc, oc), _mul_(this.radius, this.radius));

    let discriminant = _sub_(_mul_(b, b), _mul_(a, c));

    if (discriminant < 0) return false;

    let temp = _div_(_sub_(_negate_(b), Math.sqrt(discriminant)), a);

    let isValid = temp < tmax && temp > tmin;

    if (!isValid) {
      temp = _div_(_add_(_negate_(b), Math.sqrt(discriminant)), a);
      isValid = temp < tmax && temp > tmin;
    }

    if (isValid) {
      record.t = temp;
      record.p = ray.pointAt(temp);
      record.normal = _div_(_sub_(record.p, this.center), this.radius);
      record.material = this.material;
      return true;
    }

    return false;
  }

}

class HitableList {
  constructor(list) {
    this.list = list;
  }

  hit(ray, tmin, tmax, record) {
    let tempRecord = createRecord();
    let hited = false;
    let closest = tmax;

    for (let object of this.list) {
      if (object.hit(ray, tmin, closest, tempRecord)) {
        hited = true;
        closest = tempRecord.t;
        Object.assign(record, tempRecord);
      }
    }

    return hited;
  }

  push(...args) {
    this.list.push(...args);
  }

}

class Camera {
  constructor(lookFrom, lookAt, vup, vfov, aspect) {
    let theta = _div_(_mul_(vfov, Math.PI), 180);

    let halfHeight = Math.tan(_div_(theta, 2));

    let halfWidth = _mul_(halfHeight, aspect);

    let origin = lookFrom;
    let w = normalize(_sub_(lookFrom, lookAt));
    let u = normalize(cross(vup, w));
    let v = cross(w, u);

    let lowerLeftCorner = _sub_(_sub_(_sub_(origin, _mul_(u, halfWidth)), _mul_(v, halfHeight)), w);

    let horizontal = _mul_(_mul_(2, u), halfWidth);

    let vertical = _mul_(_mul_(2, v), halfHeight);

    this.origin = origin;
    this.lowerLeftCorner = lowerLeftCorner;
    this.horizontal = horizontal;
    this.vertical = vertical;
  }

  getRay(u, v) {
    let {
      origin,
      lowerLeftCorner,
      horizontal,
      vertical
    } = this;

    let direction = _sub_(_add_(_add_(lowerLeftCorner, _mul_(u, horizontal)), _mul_(v, vertical)), origin);

    let ray = new Ray(origin, direction);
    return ray;
  }

}

const randomInUnitSphere = () => {
  let p;

  do {
    let randomVec3 = from(Math.random(), Math.random(), Math.random());
    p = _sub_(_mul_(2.0, randomVec3), from(1.0, 1.0, 1.0));
  } while (vec3.squaredLength(p) >= 1.0);

  return p;
};

class LambertianMaterial {
  constructor(albedo) {
    this.albedo = albedo;
  }

  scatter(ray, record, ref) {
    let target = _add_(_add_(record.p, record.normal), randomInUnitSphere());

    let direction = _sub_(target, record.p);

    ref.scattered = new Ray(record.p, direction);
    ref.attenuation = this.albedo;
    return true;
  }

}

const reflect = (v, n) => {
  return _sub_(v, _mul_(_mul_(2.0, dot(v, n)), n));
};

class MetalMaterial {
  constructor(albedo, fuzz = 1) {
    this.albedo = albedo;
    this.fuzz = Math.min(fuzz, 1);
  }

  scatter(ray, record, ref) {
    let reflected = reflect(vec3.normalize(vec3.create(), ray.direction()), record.normal);
    ref.scattered = new Ray(record.p, _add_(reflected, _mul_(this.fuzz, randomInUnitSphere())));
    ref.attenuation = this.albedo;
    return dot(ref.scattered.direction(), record.normal) > 0;
  }

}

const refract = (v, normal, ni_over_nt, ref) => {
  let uv = vec3.normalize(vec3.create(), v);
  let dt = dot(uv, normal);

  let discriminant = _sub_(1.0, _mul_(_mul_(ni_over_nt, ni_over_nt), _sub_(1.0, _mul_(dt, dt))));

  if (discriminant > 0) {
    ref.refracted = _sub_(_mul_(ni_over_nt, _sub_(uv, _mul_(normal, dt))), _mul_(normal, Math.sqrt(discriminant)));
    return true;
  }

  return false;
};

const schlick = (consine, refractIndex) => {
  let r0 = _div_(_sub_(1, refractIndex), _add_(1, refractIndex));

  r0 = _mul_(r0, r0);
  return _add_(r0, _mul_(_sub_(1, r0), Math.pow(_sub_(1, consine), 5)));
};

class DielectricMaterial {
  constructor(refractIndex) {
    this.refractIndex = refractIndex;
  }

  scatter(ray, record, ref) {
    let outwardNormal = vec3.create();
    let reflected = reflect(ray.direction(), record.normal);
    let ni_over_nt = 0.0;
    let consine = 0.0;
    ref.attenuation = from(1.0, 1.0, 1.0);
    let dotResult = dot(ray.direction(), record.normal);

    if (dotResult > 0) {
      outwardNormal = _negate_(record.normal);
      ni_over_nt = this.refractIndex;
      consine = _div_(_mul_(this.refractIndex, dotResult), vec3.length(ray.direction()));
    } else {
      outwardNormal = record.normal;
      ni_over_nt = _div_(1.0, this.refractIndex);
      consine = _div_(_negate_(dotResult), vec3.length(ray.direction()));
    }

    let refractProb = 0.0;

    if (refract(ray.direction(), outwardNormal, ni_over_nt, ref)) {
      refractProb = schlick(consine, this.refractIndex);
    } else {
      refractProb = 1.0;
    }

    if (Math.random() < refractProb) {
      ref.scattered = new Ray(record.p, reflected);
    } else {
      ref.scattered = new Ray(record.p, ref.refracted);
    }

    return true;
  }

}

const color = (ray, world, depth = 0) => {
  let record = createRecord();

  if (world.hit(ray, 0.001, Infinity, record)) {
    let ref = {
      scattered: null,
      attenuation: 0
    };

    if (depth >= 50 || !record.material.scatter(ray, record, ref)) {
      return from(0.0, 0.0, 0.0);
    }

    return _mul_(ref.attenuation, color(ref.scattered, world, _add_(depth, 1)));
  }

  let direction = vec3.normalize(vec3.create(), ray.direction());
  return lerp(_mul_(0.5, _add_(direction[1], 1.0)), from(1.0, 1.0, 1.0), from(0.5, 0.7, 1.0));
};

const test = () => {
  let content = [];
  let nx = 200;
  let ny = 100;
  let ns = 100;
  content.push('P3');
  content.push(`${nx} ${ny}`);
  content.push('255');
  let lookFrom = from(-2.0, 2.0, 1.0);
  let lookAt = from(0.0, 0.0, -1.0);
  let vup = from(0.0, 1.0, 0.0);
  let vfov = 20;

  let aspect = _div_(nx, ny);

  let camera = new Camera(lookFrom, lookAt, vup, vfov, aspect);
  let world = new HitableList([]);
  world.push(new Sphere(from(0.0, 0.0, -1.0), 0.5, new LambertianMaterial(from(0.1, 0.2, 0.5))));
  world.push(new Sphere(from(0.0, -100.5, -1.0), 100, new LambertianMaterial(from(0.8, 0.8, 0.0))));
  world.push(new Sphere(from(1.0, 0.0, -1.0), 0.5, new MetalMaterial(from(0.8, 0.6, 0.2), 0.0)));
  world.push(new Sphere(from(-1.0, 0.0, -1.0), 0.5, new DielectricMaterial(1.5)));
  world.push(new Sphere(from(-1.0, 0.0, -1.0), -0.45, new DielectricMaterial(1.5)));

  for (let j = _sub_(ny, 1); j >= 0; j--) {
    for (i = 0; i < nx; i++) {
      let col = from(0.0, 0.0, 0.0);

      for (let k = 0; k < ns; k++) {
        let u = _div_(_add_(i, Math.random()), nx);

        let v = _div_(_add_(j, Math.random()), ny);

        let ray = camera.getRay(u, v);
        col = _add_(col, color(ray, world));
      }

      col = _div_(col, ns);
      col = from(Math.sqrt(col[0]), Math.sqrt(col[1]), Math.sqrt(col[2]));
      let r = Math.floor(_mul_(255.99, col[0]));
      let g = Math.floor(_mul_(255.99, col[1]));
      let b = Math.floor(_mul_(255.99, col[2]));
      content.push([r, g, b].join(' '));
    }
  }

  fs.writeFileSync('test.ppm', content.join('\n'));
};

console.time('render');
test();
console.timeEnd('render');