// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:
// author: allex_wang <http://iallex.com>

import path from 'path'

import { version, name, author, license, description, dependencies } from './package.json'

const banner = (name, short = false) => {
  let s
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author.name || author} */`
  } else {
    s = `/**
 * ${name} v${version} - ${description}
 *
 * @author ${author}
 * Released under the ${license} license.
 */`
  }
  return s
}

const resolve = p => path.resolve(__dirname, '.', p)

const plugins = [
  'node-builtins',
  'resolve',
  'typescript',
  'babel',
  'commonjs',
  'globals'
]

export default {
  compress: true,
  destDir: resolve('lib'),
  dependencies: { events: true, ...dependencies },
  plugins: {
    replace: {
      __VERSION__: version
    },
    typescript: {
      typescript: require('@allex/typescript')
    }
  },
  entry: [
    {
      input: resolve('src/index.ts'),
      plugins,
      output: [
        { format: 'es', file: 'index.esm.js', banner: banner(name, true) },
        { format: 'cjs', file: 'index.js', banner: banner(name) }
      ]
    }
  ]
}
