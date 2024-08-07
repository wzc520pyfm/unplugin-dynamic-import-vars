import type { FilterPattern } from '@rollup/pluginutils'
import type { BaseNode } from 'estree'

export interface Options {
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should operate on.
   * By default all files are targeted.
   */
  include?: FilterPattern
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should _ignore_.
   * By default no files are ignored.
   */
  exclude?: FilterPattern
  /**
   * By default, the plugin will not throw errors when target files are not found.
   * Setting this option to true will result in errors thrown when encountering files which don't exist.
   * @default false
   */
  errorWhenNoFilesFound?: boolean
  /**
   * By default, the plugin quits the build process when it encounters an error.
   * If you set this option to true, it will throw a warning instead and leave the code untouched.
   * @default false
   */
  warnOnError?: boolean
}
