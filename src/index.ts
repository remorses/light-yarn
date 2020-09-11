import { Plugin } from '@yarnpkg/core'
import exec from './commands/exec'
import memoizefs from 'memoize-fs'
import run from './commands/run'
import chalk from 'chalk'
import os from 'os'
import path from 'path'

export const memoizer = memoizefs({
    cachePath: path.resolve(os.tmpdir(), 'yarn-plugin-cache'),
})

const plugin = {
    name: `plugin-hello-world`,
    factory: (require) => ({
        hooks: {
            afterAllInstalled() {
                console.error(chalk.green(`Invalidating lightweight cache`))
                memoizer.invalidate()
            },
        },
        commands: [run, exec],
    }),
    // TODO invalidate run cache on install, add, remove
}

// eslint-disable-next-line arca/no-default-export
export default plugin

module.exports = plugin
