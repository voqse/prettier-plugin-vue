const { vue: vueParser } = require('prettier/parser-html').parsers

const excludeDefaults = ['style']

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

function extendPrinter(defaultPrint) {
  return (path, options, print) => {
    const { vueExcludeBlocks, originalText } = options
    const { name, parent, sourceSpan } = path.getValue()

    if (parent && parent.type === 'root' && vueExcludeBlocks.includes(name)) {
      const { start, end } = sourceSpan
      return originalText.slice(start.offset, end.offset)
    }

    return defaultPrint(path, options, print)
  }
}

function preprocessor(text, options) {
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
    vue: {
      ...vueParser,
      preprocess: preprocessor,
    },
  },
  options: pluginOptions,
}
