const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  var keysA = Object.keys(objA)
  var keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}

const shallowEqualList = (listA, listB) => {
  if (!Array.isArray(listA) || !Array.isArray(listB)) {
    return false
  }

  if (listA.length !== listB.length) {
    return false
  }

  for (let i = 0; i < listA.length; i++) {
    if (!shallowEqual(listA[i], listB[i])) {
      return false
    }
  }

  return true
}

const isThenble = obj => !!(obj && typeof obj.then === 'function')

let env = null
let getEnv = () => env

const EMPTY = Symbol('empty')
const STOP = Symbol('stop')

export const isEmpty = input => input === EMPTY

const referencable = producer => {
  let refList = []
  let index = 0
  let getRef = () => refList[index]
  let setRef = value => (refList[index] = value)
  let consumeRefIndex = () => index++
  let getRefList = () => refList
  let withRef = arg => {
    env = { ...env, getRef, setRef, consumeRefIndex, getRefList }
    try {
      index = 0
      return producer(arg)
    } finally {
      index = 0
    }
  }

  return withRef
}

const resumable = producer => {
  let runing = false
  let rerun = false
  let currentArg
  let resume = () => withResume(currentArg)
  let withResume = (arg = currentArg) => {
    currentArg = arg
    if (runing) {
      rerun = true
      return
    }

    env = { ...env, resume }
    runing = true

    let result
    try {
      result = producer(arg)
    } finally {
      runing = false
    }

    if (rerun) {
      rerun = false
      return resume()
    }
    return result
  }

  return withResume
}

const cleanupEffect = effect => {
  if (typeof effect.cleanup === 'function') {
    let { cleanup } = effect
    effect.cleanup = null
    cleanup()
  }
}

const performEffect = effect => {
  let shouldPerform = !shallowEqualList(effect.currDeps, effect.prevDeps)
  if (!shouldPerform) return

  cleanupEffect(effect)

  if (typeof effect.current === 'function') {
    effect.cleanup = effect.current()
  }
}

export const performEffectList = env => {
  if (!env) throw new Error('can not perform effect')

  let refList = env.getRefList()

  for (let i = 0; i < refList.length; i++) {
    let ref = refList[i]
    if (!ref.isEffect) continue
    performEffect(ref)
  }
}

export const cleanupEffectList = env => {
  if (!env) throw new Error('can not cleanup effect')

  let refList = env.getRefList()

  for (let i = 0; i < refList.length; i++) {
    let ref = refList[i]
    if (!ref.isEffect) continue
    cleanupEffect(ref)
  }
}

export const usable = producer => {
  let f = resumable((referencable(producer)))
  return arg => {
    let currentEnv = null
    env = null
    let result = f(arg)
    currentEnv = env
    env = null
    return [result, currentEnv]
  }
}

export const useRef = value => {
  let env = getEnv()

  if (!env) {
    throw new Error('useRef can not be used out of usable function')
  }

  let { getRef, setRef, consumeRefIndex } = env
  let ref = getRef()

  if (!ref) {
    ref = { current: value }
    setRef(ref)
  }

  consumeRefIndex()

  return ref
}

export const useState = value => {
  let env = getEnv()

  if (!env) {
    throw new Error('useState can not be used out of usable function')
  }

  let { getRef, setRef, consumeRefIndex, resume } = env
  let ref = getRef()

  if (!ref) {
    let setValue = value => {
      ref.current = value
      resume()
    }
    ref = { current: value, setValue }
    setRef(ref)
  }

  consumeRefIndex()

  return [ref.current, ref.setValue]
}

export const useMemo = (f, deps) => {
  let env = getEnv()

  if (!env) {
    throw new Error('useMemo can not be used out of usable function')
  }

  let { getRef, setRef, consumeRefIndex } = env
  let ref = getRef()

  if (!ref) {
    let value = f()
    ref = { current: value, deps }
    setRef(ref)
  } else {
    let shouldRecompute = !shallowEqualList(deps, ref.deps)
    if (shouldRecompute) {
      ref.current = f()
    }
  }

  consumeRefIndex()

  return ref.current
}

export const useEffect = (f, deps) => {
  let env = getEnv()

  if (!env) {
    throw new Error('useEffect can not be used out of usable function')
  }

  let { getRef, setRef, consumeRefIndex } = env
  let ref = getRef()

  if (!ref) {
    ref = {
      isEffect: true,
      current: f,
      currDeps: deps,
      prevDeps: null,
      cleanup: null
    }
    setRef(ref)
  } else {
    ref.current = f
    ref.prevDeps = ref.currDeps
    ref.currDeps = deps
  }

  consumeRefIndex()
}

export const useCallback = (f, deps) => {
  return useMemo(() => f, deps)
}

export const useFunction = f => {
  let ref = useRef(f)
  let callback = useCallback((...args) => ref.current(...args), [])

  useEffect(() => {
    ref.current = f
  }, [f])

  return callback
}
