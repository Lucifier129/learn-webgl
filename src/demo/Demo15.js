import React, { useEffect, useRef } from 'react'
import test from '../lib/glower'

export default function Demo01() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    return test(canvas)
  }, [])

  return <canvas width={400} height={400} ref={ref} />
}
