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
