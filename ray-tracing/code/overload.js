const isLiteral = type => /literal/i.test(type)

const operators = {
  '+': '_add_',
  '-': '_sub_',
  '*': '_mul_',
  '/': '_div_',
  'unary-minus': '_negate_'
}

module.exports = function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        if (path.node.loc == null) return
        if (!'+-*/'.includes(path.node.operator)) return
        if (isLiteral(path.node.left.type) && isLiteral(path.node.right.type))
          return

        let operator = operators[path.node.operator]

        path.replaceWith(
          t.callExpression(t.identifier(operator), [
            path.node.left,
            path.node.right
          ])
        )
      },
      UnaryExpression(path) {
        if (path.node.loc == null) return
        if (path.node.operator !== '-') return
        if (isLiteral(path.node.argument.type)) return

        path.replaceWith(
          t.callExpression(t.identifier('_negate_'), [path.node.argument])
        )
      }
    }
  }
}
