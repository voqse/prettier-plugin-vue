const { vue: vueParser } = require('prettier/parser-html').parsers

const excludeDefaults = ['style']

const pluginOptions = {
  vueExcludeBlocks: {
    type: 'string',
    category: 'Vue',
    array: true,
    default: [{ value: excludeDefaults }],
    description: 'Exclude this blocks of Vue files from formatting.',
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
  const {
    printers: { html: htmlPrinter },
  } = options.plugins.find(({ printers }) => printers.html)

  if (htmlPrinter) {
    htmlPrinter.print = extendPrinter(htmlPrinter.print)
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
