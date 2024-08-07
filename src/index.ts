import path from 'node:path'

import { walk } from 'estree-walker'
import MagicString from 'magic-string'
import fastGlob from 'fast-glob'
import { generate } from 'astring'

import { createFilter } from '@rollup/pluginutils'

import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { VariableDynamicImportError, dynamicImportToGlob } from './core/dynamic-import-to-glob'
import type { Options } from './types'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options = {}) => {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'unplugin-dynamic-import-vars',
    transform(code, id) {
      if (!filter(id))
        return null

      const parsed = this.parse(code) as any

      let dynamicImportIndex = -1
      let ms: any

      walk(parsed, {
        enter: (node: any) => {
          if (node.type !== 'ImportExpression')
            return

          dynamicImportIndex += 1

          let importArg: any
          if (node.arguments && node.arguments.length > 0) {
            // stringify the argument node, without indents, removing newlines and using single quote strings
            importArg = generate(node.arguments[0], { indent: '' })
              .replace(/\n/g, '')
              .replace(/"/g, '\'')
          }

          try {
            // see if this is a variable dynamic import, and generate a glob expression
            const glob = dynamicImportToGlob(node.source, code.substring(node.start, node.end))

            if (!glob) {
              // this was not a variable dynamic import
              return
            }

            // execute the glob
            const result = fastGlob.sync(glob, { cwd: path.dirname(id) })
            const paths = result.map(r =>
              r.startsWith('./') || r.startsWith('../') ? r : `./${r}`,
            )

            if (options.errorWhenNoFilesFound && paths.length === 0) {
              const error = new Error(
                `No files found in ${glob} when trying to dynamically load concatted string from ${id}`,
              )
              if (options.warnOnError)
                this.warn(error)

              else
                this.error(error)
            }

            // create magic string if it wasn't created already
            ms = ms || new MagicString(code)
            // unpack variable dynamic import into a function with import statements per file, rollup
            // will turn these into chunks automatically
            ms.prepend(
              `function __variableDynamicImportRuntime${dynamicImportIndex}__(path) {
  switch (path) {
${paths
                .map(p => `    case '${p}': return import('${p}'${importArg ? `, ${importArg}` : ''});`)
                .join('\n')}
${`    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })\n`}   }
 }\n\n`,
            )

            // call the runtime function instead of doing a dynamic import, the import specifier will
            // be evaluated at runtime and the correct import will be returned by the injected function
            ms.overwrite(
              node.start,
              node.start + 6,
              `__variableDynamicImportRuntime${dynamicImportIndex}__`,
            )
          }
          catch (error: any) {
            if (error instanceof VariableDynamicImportError) {
              // TODO: line number
              if (options.warnOnError)
                this.warn(error)

              else
                this.error(error)
            }
            else {
              this.error(error)
            }
          }
        },
      })

      if (ms && dynamicImportIndex !== -1) {
        return {
          code: ms.toString(),
          map: ms.generateMap({
            file: id,
            includeContent: true,
            hires: true,
          }),
        }
      }
      return null
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
