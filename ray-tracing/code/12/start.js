const { transformFileAsync } = require('@babel/core')
const fs = require('fs')
const { join } = require('path')

const main = async () => {
  let src = join(__dirname, 'test.js')
  let dist = join(__dirname, 'dist.js')

  let options = {
    plugins: [join(__dirname, '../overload.js')]
  }

  let { code } = await transformFileAsync(src, options)

  fs.writeFileSync(dist, code)

  require(dist)
}

main()
