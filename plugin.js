const { vue: vueParser } = require('prettier/parser-html').parsers

const excludeDefaults = ['style']
const excludeNodeType = 'vue-exclude-content'

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

  return originalText.slice(sourceSpan.start.offset, sourceSpan.end.offset).trim()
}

function extendPrinter(defaultPrint) {
  return (path, options, print) => {
    const { vueExcludeBlocks } = options
    const node = path.getValue()

    if (node.parent && node.parent.type === 'root' && vueExcludeBlocks.includes(node.name)) {
      node.children.forEach((child) => {
        Object.assign(child, { type: excludeNodeType })
      })
    }

    if (node.type === excludeNodeType) {
      return printOriginal(node, options)
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
