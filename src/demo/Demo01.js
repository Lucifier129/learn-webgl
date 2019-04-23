import React, { useEffect, useRef } from 'react'

export default function Demo01() {
  let ref = useRef()

  useEffect(() => {
    let canvas = ref.current
    

  }, [])

  return <canvas ref={ref}></canvas>
}