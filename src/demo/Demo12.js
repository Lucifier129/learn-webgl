import React, { useState, useEffect, useRef } from 'react'
import createRayTracing from './ray-tracing'

const delay = (time = 0) => new Promise(resolve => setTimeout(resolve, time))

export default function Demo01() {
  let [count, setCount] = useState(0)
  let [time, setTime] = useState(0)
  let ref = useRef()
  let width = 800
  let height = 400

  useEffect(() => {
    let canvas = ref.current
    let ctx = canvas.getContext('2d')
    var imageData = ctx.createImageData(width, height)
    let renderImage = createRayTracing({ width, height, amount: 50 })
    let data = []
    let innerCount = 1
    let innerTime = 0
    let tid = null
    let over = false

    let render = async () => {
      let start = Date.now()
      let i = 0
      let j = 0
      let duration = 0

      for (let n of renderImage()) {
        if (typeof data[i] !== 'number') data[i] = 0
        data[i] += n
        imageData.data[i] = Math.floor(255.99 * Math.sqrt(data[i] / innerCount))
        i += 1
        j += 1
        duration = Date.now() - start
        setTime(innerTime + duration)
        if (duration % 100 === 0) await delay()
        if (over) return
      }

      if (over) return

      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(imageData, 0, 0)
      tid = setTimeout(render, 100)

      setCount(innerCount)
      setTime((innerTime += Date.now() - start))

      innerCount += 1
    }

    render()

    return () => {
      over = true
      clearTimeout(tid)
    }
  }, [])

  return (
    <>
      <canvas width={width} height={height} ref={ref} />
      <h3>光线追踪时间：{(time / 1000).toFixed(2)}秒</h3>
      <h3>渲染次数：{count}</h3>
      <h3>平均时间：{(count ? time / 1000 / count : 0).toFixed(2)}秒</h3>
    </>
  )
}
