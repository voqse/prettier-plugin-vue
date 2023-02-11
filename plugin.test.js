const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const { expect, test } = require('@jest/globals')

const fixturesDir = path.resolve(__dirname, './fixtures')
const files = fs.readdirSync(fixturesDir)

for (const sourceFileName of files) {
  if (/\.prettified\./.test(sourceFileName)) {
    continue
  }

  test(`Formats ${sourceFileName}`, async () => {
    const formattedFileName = sourceFileName.replace(/(\.[a-z]+)$/, '.prettified$1')
    const sourceFilePath = path.resolve(fixturesDir, sourceFileName)
    const formattedFilePath = path.resolve(fixturesDir, formattedFileName)

    const sourceText = fs.readFileSync(sourceFilePath, 'utf8')
    const expectedFormattedText = fs.readFileSync(formattedFilePath, 'utf8')

    const actualResult = prettier.format(sourceText, {
      filepath: sourceFilePath,
      semi: false,
      singleQuote: true,
      vueExcludeBlocks: ['style', 'template'],
      plugins: [path.resolve(__dirname, '.')],
    })

    expect(actualResult).toBe(expectedFormattedText)
  })
}
