import fs from 'fs'
import path from 'path'
import glob from 'glob'
import { curry, mergeAll, flatten, filter, not, isNil, compose, traverse, map } from 'ramda'
import Task from 'data.task'

const rootPath = path.resolve(`${__dirname}/../src`)
const outputPath = rootPath + '/assets/locales'
const outputFilename = 'en.json'
// const regexIntlImport = new RegExp(/.+from['" ]+react-intl['" ]+/)
const regexIntlComponent = new RegExp(/(<FormattedMessage[^>]+\/>|<FormattedHtmlMessage[^>]+\/>)/, 'gm')
const regexIntlId = new RegExp(/id='([^']+)'/)
const regexIntlMessage = new RegExp(/defaultMessage='([^']+)'/)
const isNotNil = compose(not, isNil)

// filenames :: String -> Task(Error, [String])
const filenames = pattern =>
  new Task((reject, resolve) =>
    glob(pattern, null, (error, files) =>
      error ? reject(error) : resolve(files)
    )
  )

// reaFile :: String -> Task(Error, data)
const readFile = filename =>
  new Task((reject, resolve) =>
    fs.readFile(filename, 'utf8', (error, files) =>
      error ? reject(error) : resolve(files)
    )
  )

// writeFile :: filename -> content -> Task(Error, Success)
const writeFile = curry((filename, content) =>
  new Task((reject, resolve) =>
    fs.writeFile(filename, content, (error) =>
      error ? reject(error) : resolve('File generated: ' + filename)
    )
  )
)

// readFiles :: [String] => Task(Error, [String])
const readFiles = traverse(Task.of, readFile)

const elements = data => data.match(regexIntlComponent)
// const hasImport = data => not(isNil(data.match(regexIntlImport)))

// toKeyValue :: String -> {key: value}
const toKeyValue = element => {
  const id = element.match(regexIntlId)
  const message = element.match(regexIntlMessage)
  if (isNotNil(id) && isNotNil(message)) {
    return {[id[1]]: message[1]}
  } else {
    console.warn('FAILED TO ADD KEY: ', id, message)
    return {}
  }
}

const toString = object => JSON.stringify(object, null, 2)

// script
filenames(rootPath + '/**/*.js')
  .chain(readFiles)
  .map(map(elements))
  .map(filter(isNotNil))
  .map(flatten)
  .map(map(toKeyValue))
  .map(mergeAll)
  .map(toString)
  .chain(writeFile(outputPath + '/' + outputFilename))
  .fork(console.warn, console.log)
