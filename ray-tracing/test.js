const fs = require('fs')

const test = () => {
  let content = []
  let nx = 200
  let ny = 100

  content.push('P3')
  content.push(`${nx} ${ny}`)
  content.push('255')

  for (let j = ny - 1; j >= 0; j--) {
    for (i = 0; i < nx; i++) {
      let r = i / nx
      let g = j / ny
      let b = 0.2
      let rgb = [r, g, b].map(n => Math.floor(n * 255.99))
      content.push(rgb.join(' '))
    }
  }

  fs.writeFileSync('test.ppm', content.join('\n'))
}

test()