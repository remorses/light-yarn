import chalk from 'chalk'
import memoizefs from 'memoize-fs'
import os from 'os'
import _ from 'lodash'
import path from 'path'
import exec from './commands/exec'
import node from './commands/node'
import run from './commands/run'


export const memoizer = memoizefs({
    cachePath: path.resolve(os.tmpdir(), 'yarn-plugin-cache'),
})

const plugin = {
    name: `plugin-hello-world`,
    factory: () => {
        // @ts-ignore use the yarn require implementation
        __non_webpack_require__(path.resolve(process.cwd(), '.pnp.js')).setup()

        return {
            hooks: {
                afterAllInstalled() {
                    console.error(chalk.green(`Invalidating lightweight cache`))
                    memoizer.invalidate()
                },
            },
            commands: [run, exec, node],
        }
    },
}

export default plugin

module.exports = plugin
