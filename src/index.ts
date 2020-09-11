import chalk from 'chalk'
import memoizefs from 'memoize-fs'
import os from 'os'
import path from 'path'
import exec from './commands/exec'
import node from './commands/node'
import run from './commands/run'

export const memoizer = memoizefs({
    cachePath: path.resolve(os.tmpdir(), 'yarn-plugin-cache'),
})

const plugin = {
    name: `plugin-hello-world`,
    factory: () => ({
        hooks: {
            afterAllInstalled() {
                console.error(chalk.green(`Invalidating lightweight cache`))
                memoizer.invalidate()
            },
        },
        commands: [run, exec, node],
    }),
}

// eslint-disable-next-line arca/no-default-export
export default plugin

module.exports = plugin
