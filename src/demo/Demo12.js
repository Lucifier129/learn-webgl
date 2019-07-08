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
const sortByMSE = (prev, current) => {
  let result = []

  for (let i = 0; i < prev.length; i += 4) {
    let index = Math.floor(i / 4)
    let listA = [prev[i + 0], prev[i + 1], prev[i + 2], prev[i + 3]]
    let listB = [current[i + 0], current[i + 1], current[i + 2], current[i + 3]]

    result[index] = {
      index,
      value: getMSE(listA, listB)
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
  let deubgRef = useRef()
  let width = 800
  let height = 400

  useEffect(() => {
    let canvas = ref.current
    let debugCanvas = deubgRef.current
    let ctx = canvas.getContext('2d')
    let ray = createRayTracing({ width, height, amount: 50 })
    let imageData = ctx.createImageData(width, height)
    let data = new Float32Array(width * height * 4)
    let prevImageData = new Float32Array(width * height * 4)
    let currImageData = new Float32Array(width * height * 4)
    let renderCount = new Float32Array(width * height * 4)
    let innerCount = 1
    let innerTime = 0
    let tid = null
    let over = false

    let renderToCanvas = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(imageData, 0, 0)
    }

    let showData = () => {
      let data = renderCount
      let ctx = debugCanvas.getContext('2d')
      let imageData = ctx.createImageData(width, height)

      for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 4 === 0) {
          imageData.data[i] = 255
        } else {
          imageData.data[i] = data[i]
        }
      }
      ctx.clearRect(0, 0, width, height)
      ctx.putImageData(imageData, 0, 0)
    }

    let renderByPosition = (x, y) => {
      let [r, g, b, a = 1] = ray.renderByPosition(x, y)
      let i = ((height - y) * width + x) * 4

      data[i + 0] += r
      data[i + 1] += g
      data[i + 2] += b
      data[i + 3] += a

      renderCount[i + 0] += 1
      renderCount[i + 1] += 1
      renderCount[i + 2] += 1
      renderCount[i + 3] += 1

      prevImageData[i + 0] = imageData.data[i + 0]
      prevImageData[i + 1] = imageData.data[i + 1]
      prevImageData[i + 2] = imageData.data[i + 2]
      prevImageData[i + 3] = imageData.data[i + 3]

      imageData.data[i + 0] = toColor(data[i + 0] / renderCount[i + 0])
      imageData.data[i + 1] = toColor(data[i + 1] / renderCount[i + 1])
      imageData.data[i + 2] = toColor(data[i + 2] / renderCount[i + 2])
      imageData.data[i + 3] = toColor(data[i + 3] / renderCount[i + 3])

      currImageData[i + 0] = imageData.data[i + 0]
      currImageData[i + 1] = imageData.data[i + 1]
      currImageData[i + 2] = imageData.data[i + 2]
      currImageData[i + 3] = imageData.data[i + 3]
    }

    let render = async () => {
      let start = Date.now()
      let i = 0
      let duration = 0

      for (let n of ray.render()) {
        renderCount[i] += 1
        data[i] += n
        prevImageData[i] = imageData.data[i]
        imageData.data[i] = toColor(data[i] / renderCount[i])
        currImageData[i] = imageData.data[i]
        i += 1
        duration = Date.now() - start
        if (duration % 100 === 0) {
          setTime(innerTime + duration)
          await frame(() => {
            renderToCanvas()
            showData()
          })
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

    let scheduleRender = async (count = 0) => {
      let list = sortByMSE(prevImageData, currImageData)
      let start = Date.now()
      let duration = 0

      for (let i = 0; i < 20000; i++) {
        let item = list[i]
        let x = item.index % width
        let y = height - Math.floor(item.index / width)
        
        renderByPosition(x, y)
        duration = Date.now() - start

        if (duration % 100 === 0) {
          setTime(innerTime + duration)
          await frame(() => {
            renderToCanvas()
            showData()
          })
        }
        if (over) return
      }

      if (over) return

      renderToCanvas()
      setCount(innerCount)
      setTime((innerTime += Date.now() - start))
      tid = requestAnimationFrame(() => {
        if (count < 5) {
          scheduleRender(count + 1)
        } else {
          render()
        }
      })
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
      <canvas width={width} height={height} ref={deubgRef} />
      <h3>光线追踪时间：{(time / 1000).toFixed(2)}秒</h3>
      <h3>渲染次数：{count}</h3>
      <h3>平均时间：{(count ? time / 1000 / count : 0).toFixed(2)}秒</h3>
    </>
  )
}
