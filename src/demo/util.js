export const glsl = x => x

export const loadImage = src => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.onload = () => resolve(image)
    image.onerror = error => reject(error)
    image.src = src
  })
}

export const loadImageList = (list = []) => {
  return Promise.all(list.map(loadImage))
}

export const getX = (rect, clientX) => {
  return (clientX - rect.left - rect.width / 2) / (rect.width / 2)
}

export const getY = (rect, clientY) => {
  return (rect.height / 2 - (clientY - rect.top)) / (rect.height / 2)
}

export const getPosition = (canvas, event) => {
  let rect = canvas.getBoundingClientRect()
  return [getX(rect, event.clientX), getY(rect, event.clientY)]
}

export const createVertexList = (list = []) => {
  return new Float32Array(list.flat(Infinity))
}

/**
 * [
 *    [1, 2, 3, 4],
 *    [5, 6, 7, 8],
 *    [9, 10, 11, 12],
 *    [13, 14, 15, 16]
 * ]
 */
export const createMatrix = sourceList => {
  let data = [[], [], [], []]

  for (let array of sourceList) {
    data[0].push(array[0])
    data[1].push(array[1])
    data[2].push(array[2])
    data[3].push(array[3])
  }

  return new Float32Array(data.flat())
}

export const createRotateZMatrix = (angle = 0) => {
  let radian = (angle * Math.PI) / 180
  let sinB = Math.sin(radian)
  let cosB = Math.cos(radian)

  return createMatrix([
    [cosB, -sinB, 0.0, 0.0],
    [sinB, cosB, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
  ])
}

export const createTranslateMatrix = (x = 0, y = 0, z = 0) => {
  return createMatrix([
    [1.0, 0.0, 0.0, x],
    [0.0, 1.0, 0.0, y],
    [0.0, 0.0, 1.0, z],
    [0.0, 0.0, 0.0, 1.0]
  ])
}

export const createScaleMatrix = (scaleX = 1, scaleY = 1, scaleZ = 1) => {
  return createMatrix([
    [scaleX, 0.0, 0.0, 0],
    [0, scaleY, 0, 0],
    [0, 0, scaleZ, 0],
    [0, 0, 0, 1]
  ])
}
