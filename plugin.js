const { vue: vueParser } = require('prettier/parser-html').parsers

const excludeDefaults = ['style']
const excludeNodeType = 'vue-excluded-content'

let defaultHtmlPrinter

const pluginOptions = {
  vueExcludeBlocks: {
    type: 'string',
    category: 'Vue',
    array: true,
    default: [{ value: excludeDefaults }],
    description: 'Ignore this blocks while formatting Vue SFC files.',
  },
}

function printOriginal(node, options) {
  const { originalText } = options
  const { sourceSpan } = node

  return originalText.slice(sourceSpan.start.offset, sourceSpan.end.offset)
}

function extendPrinter(defaultPrint) {
  return (path, options, print) => {
    const { vueExcludeBlocks } = options
    const node = path.getValue()

    if (node.parent && node.parent.type === 'root' && vueExcludeBlocks.includes(node.name)) {
      const { start } = node.children[0].sourceSpan
      const { end } = node.children[node.children.length - 1].sourceSpan

      node.children = [
        {
          sourceSpan: { start, end },
          type: excludeNodeType,
        },
      ]
    }

    if (node.type === excludeNodeType) {
      return printOriginal(node, options).trim()
    }

    return defaultPrint(path, options, print)
  }
}

function preprocess(text, options) {
  if (!defaultHtmlPrinter) {
    defaultHtmlPrinter = options.plugins.find(({ printers }) => printers.html).printers.html

    if (defaultHtmlPrinter) {
      defaultHtmlPrinter.print = extendPrinter(defaultHtmlPrinter.print)
    }
  }

  return text
}

module.exports = {
  parsers: {
    vue: Object.assign(vueParser, { preprocess }),
  },
  options: pluginOptions,
}
