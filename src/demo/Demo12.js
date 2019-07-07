import React, { useState, useEffect, useRef } from 'react'
import createRayTracing from './ray-tracing'

const noop = () => {}
const frame = (f = noop) =>
  new Promise(resolve => {
    requestAnimationFrame(() => {
      f()
      resolve()
    })
  })

const getMSE = (listA, listB) => {
  let sum = 0
  for (let i = 0; i < listA.length; i++) {
    sum += Math.pow(listA[i] - listB[i], 2)
  }
  return sum / listA.length
}

// mean squared error
const sortByMSE = (prev, current, renderCount) => {
  let result = []

  for (let i = 0; i < prev.length; i += 4) {
    let index = Math.floor(i / 4)
    let listA = [prev[i + 0], prev[i + 1], prev[i + 2], prev[i + 3]]
    let listB = [current[i + 0], current[i + 1], current[i + 2], current[i + 3]]

    result[index] = {
      index,
      value: getMSE(listA, listB) / renderCount[i]
    }
  }

  return result.sort((a, b) => b.value - a.value)
}

const toColor = value => {
  return Math.floor(255.99 * Math.sqrt(value))
}

export default function Demo01() {
  let [count, setCount] = useState(0)
  let [time, setTime] = useState(0)
  let ref = useRef()
  let width = 800
  let height = 400

  useEffect(() => {
    let canvas = ref.current
    let ctx = canvas.getContext('2d')
    let ray = createRayTracing({ width, height, amount: 50 })
    let imageData = ctx.createImageData(width, height)
    let data = new Float32Array(width * height * 4)
    let cache = new Float32Array(width * height * 4)
    let renderCount = new Float32Array(width * height * 4)
    let innerCount = 1
    let innerTime = 0
    let tid = null
    let over = false

    let renderToCanvas = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(imageData, 0, 0)
    }

    let render = async () => {
      let start = Date.now()
      let i = 0
      let duration = 0

      for (let n of ray.render()) {
        renderCount[i] += 1
        data[i] += n
        cache[i] = imageData.data[i]
        imageData.data[i] = toColor(data[i] / renderCount[i])
        i += 1
        duration = Date.now() - start
        if (duration % 100 === 0) {
          setTime(innerTime + duration)
          await frame(renderToCanvas)
        }
        if (over) return
      }

      if (over) return

      renderToCanvas()
      setCount(innerCount)
      setTime((innerTime += Date.now() - start))
      innerCount += 1

      if (innerCount > 2) {
        scheduleRender()
      } else {
        tid = requestAnimationFrame(render)
      }
    }

    let scheduleRender = async () => {
      let list = sortByMSE(cache, imageData.data, renderCount)
      let start = Date.now()
      let duration = 0

      for (let i = 0; i < 100000; i++) {
        let item = list[i]
        let index = item.index * 4
        let x = item.index % width
        let y = height - Math.floor(item.index / width)
        let [r, g, b, a = 1] = ray.renderByPosition(x, y)

        let rIndex = index + 0
        let gIndex = index + 1
        let bIndex = index + 2
        let aIndex = index + 3

        renderCount[rIndex] += 1
        renderCount[gIndex] += 1
        renderCount[bIndex] += 1
        renderCount[aIndex] += 1

        data[rIndex] += r
        data[gIndex] += g
        data[bIndex] += b
        data[aIndex] += a

        cache[rIndex] = imageData.data[rIndex]
        cache[gIndex] = imageData.data[gIndex]
        cache[bIndex] = imageData.data[bIndex]
        cache[aIndex] = imageData.data[aIndex]

        imageData.data[rIndex] = toColor(data[rIndex] / renderCount[rIndex])
        imageData.data[gIndex] = toColor(data[gIndex] / renderCount[gIndex])
        imageData.data[bIndex] = toColor(data[bIndex] / renderCount[bIndex])
        imageData.data[aIndex] = toColor(data[aIndex] - 1 / renderCount[aIndex])

        duration = Date.now() - start

        if (duration > 20000) {
          return render()
        }
        
        if (duration % 100 === 0) {
          setTime(innerTime + duration)
          await frame(renderToCanvas)
        }
        if (over) return
      }

      if (over) return

      renderToCanvas()
      setCount(innerCount)
      setTime((innerTime += Date.now() - start))
      tid = requestAnimationFrame(scheduleRender)
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
